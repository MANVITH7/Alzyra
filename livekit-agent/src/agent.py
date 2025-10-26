import logging
import os

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
)
from livekit.plugins import silero, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from anthropic import Anthropic

logger = logging.getLogger("agent")
load_dotenv(".env")

# ---- Claude setup ----
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")
anthropic_client = Anthropic(api_key=CLAUDE_API_KEY)

SYSTEM_PROMPT = """
You are a calm, supportive memory companion for individuals experiencing early-stage memory loss.
Speak slowly, warmly, and reassuringly.
Encourage recall gently and never mention "forgetting" or memory failure.
"""

# ---- Assistant ----
class Assistant(Agent):
    def __init__(self):
        super().__init__(instructions=SYSTEM_PROMPT)

    async def on_text(self, participant, message):
        user_input = message.text
        logger.info(f"[User] {user_input}")

        # Claude completion
        response = anthropic_client.completions.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens_to_sample=200,
            prompt=SYSTEM_PROMPT + "\n\nHuman: " + user_input + "\n\nAssistant:"
        )

        reply = response.completion
        logger.info(f"[Agent] {reply}")
        await self.say(reply)


# ---- Prewarm VAD ----
def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


# ---- Entry point ----
async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}

    # Create agent session
    session = AgentSession(
        stt="assemblyai/universal-streaming:en",  # keep AssemblyAI STT
        llm=None,  # LLM is handled in Assistant via Claude
        tts="cartesia/sonic-2:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",  # keep TTS
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    # Metrics collection
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # Start session with our Assistant
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC()
        ),
    )

    await ctx.connect()

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))