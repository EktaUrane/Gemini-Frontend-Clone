import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  chatroomId: string;
  sender: 'user' | 'ai';
  text?: string;
  imageUrl?: string | null;
  timestamp: number;
}

interface MessageState {
  messages: { [chatroomId: string]: Message[] };
  addMessage: (chatroomId: string, sender: 'user' | 'ai', content: { text?: string; imageUrl?: string | null }) => void;
  ensureChatroomMessages: (chatroomId: string) => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      messages: {
        'initial-chatroom-1': [
          { id: uuidv4(), chatroomId: 'initial-chatroom-1', sender: 'user', text: 'Hello Gemini!', timestamp: Date.now() - 60000 },
          { id: uuidv4(), chatroomId: 'initial-chatroom-1', sender: 'ai', text: 'Hello! How can I help you today?', timestamp: Date.now() - 55000 },
        ],
      },
      addMessage: (chatroomId, sender, content) => {
        set((state) => {

          const currentMessages = state.messages[chatroomId] ? [...state.messages[chatroomId]] : [];
          const newMessage: Message = {
            id: uuidv4(),
            chatroomId,
            sender,
            timestamp: Date.now(),
            ...content,
          };
          return {
            messages: {
              ...state.messages,
              [chatroomId]: [...currentMessages, newMessage],
            },
          };
        });
      },
      ensureChatroomMessages: (chatroomId: string) => {
        set((state) => {
          if (!state.messages[chatroomId]) {
            return {
              messages: {
                ...state.messages,
                [chatroomId]: [],
              },
            };
          }
          return state;
        });
      },
    }),
    {
      name: 'gemini-messages-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        if (state) {
          for (const chatroomId in state.messages) {
            if (!Array.isArray(state.messages[chatroomId])) {
              state.messages[chatroomId] = [];
            }
          }
        }
      },
    }
  )
);