import api from "../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Conversation, Message, Pagination, User } from "../interfaces";

export const newConversation = createAsyncThunk(
  "chats/newConversation",
  async (
    data: { senderId: string; receiverId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<{ new_conversation: Conversation }>(
        "conversation",
        data
      );

      return { new_conversation: res.data.new_conversation };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

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
    payload: { currentUserId: string; conversationId: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get<{
        conversation_messages: Message[];
        pagination: Pagination;
      }>("message/" + payload.currentUserId + "/" + payload.conversationId, {
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
      const res = await api.post<{ new_msg: Message }>("message", formData, {
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent.loaded / progressEvent.total);
        },
      });

      return { new_msg: res.data.new_msg };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const searchUsers = createAsyncThunk(
  "chats/searchUsers",
  async (searchName: string, { rejectWithValue }) => {
    try {
      const res = await api.post<{ users: User[] }>(
        "conversation/search-users",
        { searchName }
      );

      return { users: res.data.users };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const unsend = createAsyncThunk(
  "chats/unsend",
  async (msgId: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<{ unsent_msg: Message }>(
        "message/unsend/" + msgId
      );

      return { unsent_msg: res.data.unsent_msg };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const deleteForCurrentUser = createAsyncThunk(
  "chats/deleteForMe",
  async (
    payload: { msgId: string; currentUserId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.delete<{ unsent_msg: Message }>(
        "message/" + payload.currentUserId + "/" + payload.msgId
      );

      return res;
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const markConversationSeen = createAsyncThunk(
  "chats/markSeen",
  async (
    payload: { conversationId: string; currentUserId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("conversation/mark-seen", payload);

      return res;
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);
