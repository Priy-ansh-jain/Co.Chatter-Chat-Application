// src/store/index.js

import { create } from "zustand";
import { createAuthStore } from "./manager/auth-manager";
import { createChatSlice } from "./manager/chat-manager";

export const useAppStore = create((set, get) => ({
  ...createAuthStore(set, get),
  ...createChatSlice(set, get),
}));
