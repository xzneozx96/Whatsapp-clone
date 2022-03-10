import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { Conversation, Message, Pagination } from "interfaces";
import {
  getConversationPaginatedMessages,
  getCurrentConversation,
  getMyConversations,
} from "redux/async-thunks";
interface ChatState {
  socket: Socket | null;
  currentChat: Conversation | null;
  currentMessages: Message[];
  onlineFriends: string[];
  chats: Conversation[];
  newArrivalMsg: {
    _id: string;
    conversationId: string;
    senderId: string;
    message: string;
    files: {
      path: string;
      fileType: string;
      fileName: string;
    }[];
    createdAt: string;
    sent: boolean;
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

const initialChatState: ChatState = {
  socket: null,
  chats: [],
  currentChat: null,
  currentMessages: [],
  onlineFriends: [],
  newArrivalMsg: {
    _id: "",
    conversationId: "",
    senderId: "",
    message: "",
    files: [],
    sent: true,
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
      const newArrivalMsg = action.payload;
      const { currentMessages, chats, currentChat } = state;

      // 1. Update current messages
      state.newArrivalMsg = newArrivalMsg;

      if (
        newArrivalMsg &&
        currentChat?.members.some((mem) => mem._id === newArrivalMsg.senderId)
      ) {
        state.currentMessages = [...currentMessages, newArrivalMsg];
      }

      // update scrollBottom property by adding 1 to it if the newArrivalMsg is from current user so that the chatbox automatically scroll to bottom

      // if the newArrivalMsg is from a friend, we just want to notify current user of the new message and let them scroll to bottom manually by not updating the scrollBottom
      if (action.payload.currentUserId === action.payload.senderId) {
        state.scrollBottom++;
      }

      // 2. Update current chats
      // get the conversation where the new message comes from
      const { conversationId } = newArrivalMsg;

      const updated_chats = chats.map((chat) => {
        if (chat._id === conversationId) {
          return { ...chat, latestMsg: newArrivalMsg, seen: false };
        }

        return chat;
      });

      // move the newly updated chat to the top of the chat list
      const single_updated_chat = updated_chats.find(
        (chat) => chat._id === conversationId
      );

      single_updated_chat!.hasMsg = true;

      const other_chats = updated_chats.filter(
        (chat) => chat._id !== conversationId
      );

      state.chats = [single_updated_chat!, ...other_chats];
    },

    newConversation: (state, action) => {
      const duplicated_conversation = state.chats.find(
        (chat) => chat._id === action.payload._id
      );

      if (duplicated_conversation) return;

      state.chats = [action.payload, ...state.chats];
    },

    msgUnsent: (state, action) => {
      const msgUnsent = action.payload;

      const { currentMessages, currentChat, chats } = state;

      // 1. update messages list
      if (
        msgUnsent &&
        currentChat?.members.some((mem) => mem._id === msgUnsent.receiverId)
      ) {
        const updated_messages = currentMessages.map((msg) => {
          if (msg._id === msgUnsent._id) {
            return { ...msg, sent: false };
          }
          return msg;
        });

        state.currentMessages = updated_messages;
      }

      // 2. update chats list. The below block of code is used to update the latestMsg field in case the unsend message is the latestMsg
      const on_update_conversation = chats.find(
        (chat) => chat._id === msgUnsent.conversationId
      );

      // check if the unsentMsg is the latestMsg
      const is_unsend_same_as_latest =
        msgUnsent._id === on_update_conversation!.latestMsg._id;

      if (is_unsend_same_as_latest) {
        const updated_conversations = chats.map((chat) => {
          if (chat._id === on_update_conversation?._id) {
            return { ...chat, latestMsg: { ...chat.latestMsg, sent: false } };
          }

          return chat;
        });
        state.chats = updated_conversations;
      }
    },

    deleteForMe: (state, action) => {
      const deleted_msg = action.payload;
      const { currentMessages } = state;
      const sent_messages = currentMessages.filter(
        (msg) => msg._id !== deleted_msg._id
      );
      state.currentMessages = sent_messages;
    },

    conversationSeen: (state) => {
      const { currentChat, chats } = state;

      const updated_chats = chats.map((chat) => {
        if (chat._id === currentChat?._id) {
          return { ...chat, seen: true };
        }

        return chat;
      });

      state.chats = updated_chats;
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

      // reset currentMessages whenever a conversation is fetched
      state.currentMessages = [];

      // update scrollBottom so that chat box auto scroll every time currentChat is updated (user visits a chat)
      state.scrollBottom++;
    });

    builder.addCase(
      getConversationPaginatedMessages.fulfilled,
      (state, action) => {
        let { conversation_messages, pagination } = action.payload;

        const older_messages = conversation_messages.reverse();

        state.pagination = pagination;
        state.currentMessages = [...older_messages, ...state.currentMessages];
      }
    );
  },
});

export const chatReducers = chatSlice.reducer;
export const chatActions = chatSlice.actions;
