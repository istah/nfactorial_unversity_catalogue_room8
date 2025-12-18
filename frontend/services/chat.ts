import { Message } from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ChatHistory {
  role: string;
  content: string;
}

interface ChatResponse {
  response: string;
  tool_calls: string[] | null;
}

export const chatService = {
  // Send message to AI assistant
  async sendMessage(content: string, chatHistory: ChatHistory[] = []): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content,
        chat_history: chatHistory,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to send message' }));
      throw new Error(error.detail || 'Failed to send message');
    }

    const data: ChatResponse = await response.json();
    return data.response;
  },
};
