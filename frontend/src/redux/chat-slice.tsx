import api from "../api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Conversation, Pagination, Message } from "../interfaces";
import { Socket } from "socket.io-client";
interface ChatState {
  socket: Socket | null;
  currentChat: Conversation | null;
  onlineFriends: string[];
  chats: Conversation[];
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
  pagination: Pagination | null;
}

// interface ChatState {
//   socket: Socket | null;
//   chats: SingleChat[];
//   currentChat: Conversation | null;
//   onlineFriends: string[];
// }

// interface SingleChat {
//   chat: Conversation;
//   newArrivalMsg: {
//     _id: string;
//     conversationId: string;
//     senderId: string;
//     message: string;
//     createdAt: string;
//     currentUserId?: string;
//   };
//   senderTyping: {
//     sender: string;
//     receiverId: string;
//     typing: boolean;
//     conversationId: string;
//   };
//   scrollBottom: number;
//   pagination: Pagination | null;
// }

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

export const getConversationPaginatedMessages = createAsyncThunk(
  "chats/getConversationMessages",
  async (
    payload: { conversationId: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get<{
        conversation_messages: Message[];
        pagination: Pagination;
      }>("message/" + payload.conversationId, {
        params: { page: payload.page },
      });

      const { conversation_messages, pagination } = res.data;

      return { conversation_messages, pagination };
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

export const sendFiles = createAsyncThunk(
  "chats/uploadFiles",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("message/files-upload", formData, {
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent.loaded / progressEvent.total);
        },
      });

      console.log(res.data);
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
  pagination: null,
};

// const initialChatState: ChatState = {
//   socket: null,
//   chats: [],
//   currentChat: null,
//   onlineFriends: [],
// };

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

    // newArrivalMsg: (state, action) => {},

    // senderTyping: (state, action) => {},

    // manualScrollBottom: (state, action) => {},
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

    builder.addCase(
      getConversationPaginatedMessages.fulfilled,
      (state, action) => {
        state.pagination = action.payload.pagination;
      }
    );
  },
});

export const chatReducers = chatSlice.reducer;
export const chatActions = chatSlice.actions;
