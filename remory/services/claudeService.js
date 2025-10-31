// Claude API Service for Memory Recall Conversations
// Uses Anthropic's Claude API to have contextual conversations about memories

import { ANTHROPIC_API_KEY } from '@env';

class ClaudeService {
  constructor() {
    this.apiKey = ANTHROPIC_API_KEY;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-5-sonnet-20241022'; // Latest Claude model
  }

  /**
   * Start a memory recall conversation
   * @param {object} memoryContext - The memory to discuss
   * @returns {Promise<string>} - Claude's initial response with questions
   */
  async startMemoryConversation(memoryContext) {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userMessage = this.buildInitialMemoryPrompt(memoryContext);

      const response = await this.sendMessage(systemPrompt, [
        {
          role: 'user',
          content: userMessage
        }
      ]);

      return response;
    } catch (error) {
      console.error('Failed to start memory conversation:', error);
      throw error;
    }
  }

  /**
   * Continue the conversation with user's response
   * @param {array} conversationHistory - Previous messages
   * @param {string} userResponse - User's latest response
   * @returns {Promise<string>} - Claude's follow-up response
   */
  async continueConversation(conversationHistory, userResponse) {
    try {
      const systemPrompt = this.buildSystemPrompt();

      // Add user's response to history
      const messages = [
        ...conversationHistory,
        {
          role: 'user',
          content: userResponse
        }
      ];

      const response = await this.sendMessage(systemPrompt, messages);
      return response;
    } catch (error) {
      console.error('Failed to continue conversation:', error);
      throw error;
    }
  }

  /**
   * Send message to Claude API
   * @param {string} systemPrompt - System instructions
   * @param {array} messages - Conversation history
   * @returns {Promise<string>} - Claude's response
   */
  async sendMessage(systemPrompt, messages) {
    try {
      console.log('Sending message to Claude API...');

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Claude API response received');

      // Extract text from response
      const assistantMessage = data.content[0].text;
      return assistantMessage;

    } catch (error) {
      console.error('Claude API request failed:', error);
      throw error;
    }
  }

  /**
   * Build system prompt for memory recall conversations
   * @returns {string} - System prompt
   */
  buildSystemPrompt() {
    return `You are a compassionate AI assistant helping people with memory loss, particularly those with Alzheimer's disease or dementia. Your role is to help patients recall and reconstruct their memories through gentle, patient conversations.

Guidelines:
1. Be warm, empathetic, and patient in your tone
2. Ask open-ended questions to help trigger memory recall
3. Focus on sensory details (what they saw, heard, felt, smelled, tasted)
4. Encourage them to talk about emotions and feelings
5. Never rush - give patients time to think and remember
6. Be supportive if they struggle to remember details
7. Ask 2-3 thoughtful questions at a time, not too many
8. Help them build a complete picture of the memory
9. Celebrate when they remember details
10. If they seem confused or frustrated, offer comfort and reassurance

Remember: You're a source of comfort and support. Maintain a gentle, reassuring presence throughout the conversation.`;
  }

  /**
   * Build initial prompt for memory recall
   * @param {object} memoryContext - Memory details
   * @returns {string} - Initial user message
   */
  buildInitialMemoryPrompt(memoryContext) {
    const { title, time, type, strength } = memoryContext;

    return `I'd like to remember more about this memory:

Title: ${title}
Time: ${time}
Type: ${type}
Memory strength: ${strength}%

Please help me recall this memory by asking me thoughtful questions. Start with a warm greeting and then ask me a few questions to help me remember what happened. Focus on details that might trigger my memory.`;
  }

  /**
   * Build prompt for confusion/disorientation support
   * @returns {string} - Support message prompt
   */
  buildConfusionSupportPrompt() {
    return `I'm feeling confused and disoriented right now. I need help remembering where I am, what I'm doing, and what's happening around me. Please help me feel grounded and oriented.`;
  }

  /**
   * Start a conversation for confusion support
   * @returns {Promise<string>} - Claude's supportive response
   */
  async startConfusionSupport() {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userMessage = this.buildConfusionSupportPrompt();

      const response = await this.sendMessage(systemPrompt, [
        {
          role: 'user',
          content: userMessage
        }
      ]);

      return response;
    } catch (error) {
      console.error('Failed to start confusion support:', error);
      throw error;
    }
  }
}

export default new ClaudeService();
