import { useEffect } from "react";

import { io } from "socket.io-client";
import { chatActions } from "../redux/chat-slice";

export function useSocket(userId: string, dispatch: any) {
  useEffect(() => {
    const socket = io("ws://localhost:3500", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    dispatch(chatActions.setSocket(socket));

    // "join" is the name of the event that our socket server is listening to
    socket.emit("join", userId);

    // listen to "online" event fired by socket server every time a user visits the app
    socket.on("online", (user) => {
      dispatch(chatActions.friendConnect(user));
    });

    socket.on("friends", (users) => {
      dispatch(chatActions.getOnlineFriends(users));
    });

    socket.on("offline", (user) => {
      dispatch(chatActions.friendLeave(user));
    });

    socket.on(
      "receiveMsg",
      ({ _id, conversationId, senderId, message, createdAt }) => {
        dispatch(
          chatActions.newArrivalMsg({
            _id,
            conversationId,
            senderId,
            message,
            createdAt,
          })
        );
      }
    );
  }, [userId, dispatch]);
}
