'use client';

import React, { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { ChatWindow, ChatInput } from '@/components/chat';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Initialize chat session
    const initSession = async () => {
      try {
        // TODO: Replace with actual API call
        // const id = await chatService.createSession();
        // setSessionId(id);

        // Using mock session for now
        setSessionId('mock-session-' + Date.now());

        // Add welcome message
        const welcomeMessage: Message = {
          id: '0',
          role: 'assistant',
          content:
            'Привет! 👋 Я AI-ассистент платформы университетов. Я помогу тебе найти идеальный университет, ответить на вопросы о требованиях для поступления и помочь с выбором специальности. Что тебя интересует?',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initSession();
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await chatService.sendMessage(sessionId, content);
      // setMessages((prev) => [...prev, response]);

      // Mock AI response for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponses = [
        'Отличный вопрос! Я могу помочь тебе с информацией об университетах и требованиях для поступления.',
        'Для поступления в большинство ведущих университетов нужны хорошие результаты на экзаменах SAT или ACT.',
        'Я рекомендую обратить внимание на специальности, которые тебя интересуют, и выбрать университеты с сильными программами в этих областях.',
        'Требования могут отличаться в зависимости от страны и университета. Хочешь узнать о конкретном университете?',
      ];

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI-ассистент</h1>
          <p className="text-gray-600">Задай вопрос об университетах и требованиях для поступления</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Messages */}
          <ChatWindow messages={messages} loading={loading} />

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>💡 AI-ассистент может помочь с информацией об университетах, но не заменяет консультацию специалистов</p>
        </div>
      </div>
    </div>
  );
}
