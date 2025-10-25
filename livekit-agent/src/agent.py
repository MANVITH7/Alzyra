import os
import asyncio
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta, timezone
from pathlib import Path

from livekit.rtc import Room
from livekit.agents import Agent
from livekit.plugins import silero
from anthropic import Anthropic

# ---- Load .env from project root ----
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# ---- LLM (Claude) ----
anthropic = Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

SYSTEM_PROMPT = """
You are a calm, supportive memory companion for individuals experiencing early-stage memory loss.
Speak slowly, warmly, and reassuringly.
Encourage recall gently and never mention "forgetting" or memory failure.
"""

# ---- LiveKit token ----
def make_livekit_token():
    exp_time = int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp())
    payload = {
        "iss": os.getenv("LIVEKIT_API_KEY"),
        "sub": "memory-companion",
        "room": "memory-care-room",
        "exp": exp_time,
        "video": {
            "room": "memory-care-room",
            "roomJoin": True,
            "roomCreate": True,
            "canPublish": True,
            "canSubscribe": True
        }
    }
    return jwt.encode(payload, os.getenv("LIVEKIT_API_SECRET"), algorithm="HS256")

# ---- MemoryCareAgent ----
class MemoryCareAgent(Agent):
    async def on_text(self, participant, message):
        user_input = message.text
        print(f"[User] {user_input}")

        response = anthropic.completions.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens_to_sample=200,
            prompt=SYSTEM_PROMPT + "\n\nHuman: " + user_input + "\n\nAssistant:"
        )

        reply = response.completion
        print(f"[Agent] {reply}")
        await self.say(reply)

# ---- Main ----
async def main():
    token = make_livekit_token()
    room = Room()
    await room.connect(os.getenv("LIVEKIT_URL"), token)

    # Load Silero VAD
    audio_vad = silero.VAD.load()

    # Initialize agent with instructions only
    agent = MemoryCareAgent(instructions=SYSTEM_PROMPT)

    print("✅ Agent running. Speak when ready…")

    # Run the agent with VAD (no STT needed for basic audio)
    await agent.run(room=room, vad=audio_vad)

if __name__ == "__main__":
    asyncio.run(main())