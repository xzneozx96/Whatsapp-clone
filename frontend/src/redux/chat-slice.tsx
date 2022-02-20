import api from "../api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Conversation } from "../interfaces/conversation";
import { Message } from "../interfaces/message";
import { Socket } from "socket.io-client";

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

export const sendMsg = createAsyncThunk(
  "chats/sendMsg",
  async (new_msg: Message, { rejectWithValue }) => {
    try {
      const res = await api.post<{ new_msg: Message }>("message", new_msg);

      return { new_msg: res.data.new_msg };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

const initialChatState: {
  socket: Socket | null;
  chats: Conversation[];
  currentChat: Conversation | null;
  onlineFriends: string[];
  newArrivalMsg: {
    _id: string;
    conversationId: string;
    senderId: string;
    message: string;
    createdAt: string;
  };
} = {
  socket: null,
  chats: [],
  currentChat: null,
  onlineFriends: [],
  newArrivalMsg: {
    _id: "",
    conversationId: "",
    senderId: "",
    message: "",
    createdAt: "",
  },
};

const chatSlice = createSlice({
  name: "chats",
  initialState: initialChatState,

  // below includes reducers that handle sync actions
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    getOnlineFriends: (state, action) => {
      state.onlineFriends = action.payload;
    },

    friendLeave: (state, action) => {
      state.onlineFriends = state.onlineFriends.filter(
        (friendId) => friendId !== action.payload
      );
    },

    friendConnect: (state, action) => {
      state.onlineFriends.push(action.payload);
    },

    newArrivalMsg: (state, action) => {
      state.newArrivalMsg = action.payload;
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
