import api from "../api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Conversation } from "../interfaces/conversation";
import { Message } from "../interfaces/message";
import { Socket } from "socket.io-client";

interface ChatState {
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
    currentUserId?: string;
  };
  senderTyping: {
    sender: string;
    receiverId: string;
    typing: boolean;
    conversationId: string;
  };
  scrollBottom: number;
}

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

const initialChatState: ChatState = {
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
  senderTyping: {
    sender: "",
    receiverId: "",
    typing: false,
    conversationId: "",
  },
  scrollBottom: 0,
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

      // update scrollBottom property by adding 1  to it if the newArrivalMsg is from current user so that the chatbox automatically scroll to bottom
      if (action.payload.currentUserId === action.payload.senderId) {
        state.scrollBottom++;
      }

      // if the newArrivalMsg is from a friend, we just want to notify current user of the new message and let them scroll to bottom manually by not updating the scrollBottom
    },

    senderTyping: (state, action) => {
      state.senderTyping = action.payload;
    },

    manualScrollBottom: (state) => {
      state.scrollBottom++;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getMyConversations.fulfilled, (state, action) => {
      state.chats = action.payload.my_conversations;
    });

    builder.addCase(getCurrentConversation.fulfilled, (state, action) => {
      state.currentChat = action.payload.conversation;

      // update scrollBottom so that chat box auto scroll every time currentChat is updated (user opens another chat)
      state.scrollBottom++;
    });
  },
});

export const chatReducers = chatSlice.reducer;
export const chatActions = chatSlice.actions;
