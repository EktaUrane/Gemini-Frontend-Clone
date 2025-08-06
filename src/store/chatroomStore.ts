import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Chatroom {
  id: string;
  name: string;
  createdAt: number;
  lastMessageAt?: number;
}

interface ChatroomState {
  chatrooms: Chatroom[];
  createChatroom: (name: string) => void;
  deleteChatroom: (id: string) => void;
  updateChatroomLastMessageTime: (id: string) => void;
}

export const useChatroomStore = create<ChatroomState>()(
  persist(
    (set) => ({
      chatrooms: [
        { id: uuidv4(), name: 'General Chat', createdAt: Date.now() - 3600000 },
        { id: uuidv4(), name: 'Work Project', createdAt: Date.now() - 7200000 },
        { id: uuidv4(), name: 'Family & Friends', createdAt: Date.now() - 10800000 },
      ], // I have created Initial dummy chatrooms for your reference.
      createChatroom: (name: string) => {
        set((state) => ({
          chatrooms: [
            ...state.chatrooms,
            { id: uuidv4(), name, createdAt: Date.now() },
          ].sort((a, b) => b.createdAt - a.createdAt),
        }));
      },
      deleteChatroom: (id: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
        }));
      },
      updateChatroomLastMessageTime: (id: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === id ? { ...room, lastMessageAt: Date.now() } : room
          ).sort((a, b) => (b.lastMessageAt || b.createdAt) - (a.lastMessageAt || a.createdAt)),
        }));
      },
    }),
    {
      name: 'gemini-chatrooms-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);