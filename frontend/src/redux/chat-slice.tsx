import api from "../api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Conversation } from "../interfaces/conversation";
import { Message } from "../interfaces/message";

export const getMyConversations = createAsyncThunk(
  "chats/getMyConversations",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get<{ my_conversations: Conversation[] }>(
        "conversation/" + userId
      );

      return { my_conversations: res.data.my_conversations };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const getCurrentConversation = createAsyncThunk(
  "chats/getCurrentConversation",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const res = await api.get<{ conversation: Conversation }>(
        "conversation/single/" + conversationId
      );
      return { conversation: res.data.conversation };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  "chats/getConversationMessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const res = await api.get<{ conversation_messages: Message[] }>(
        "message/" + conversationId
      );
      return { conversation_messages: res.data.conversation_messages };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

const initialChatState: {
  chats: Conversation[];
  currentChat: Conversation | null;
  onlineFriends: string[];
} = { chats: [], currentChat: null, onlineFriends: [] };

const chatSlice = createSlice({
  name: "chats",
  initialState: initialChatState,

  // below includes reducers that handle sync actions
  reducers: {
    getOnlineFriends: (state, action) => {
      state.onlineFriends = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getMyConversations.fulfilled, (state, action) => {
      state.chats = action.payload.my_conversations;
    });

    builder.addCase(getCurrentConversation.fulfilled, (state, action) => {
      state.currentChat = action.payload.conversation;
    });
  },
});

export const chatReducers = chatSlice.reducer;
export const chatActions = chatSlice.actions;
