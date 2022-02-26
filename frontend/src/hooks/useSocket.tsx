import { useEffect } from "react";

import { io } from "socket.io-client";
import { chatActions, getMyConversations } from "../redux/chat-slice";

export function useSocket(currentUserId: string, dispatch: any) {
  useEffect(() => {
    dispatch(getMyConversations(currentUserId || ""))
      .unwrap()
      .then(() => {
        // set up socket-io on client-side only after all conversation have been fetched to prevent unexpected bugs related to socket server response faster than nodejs server
        const socket = io("ws://localhost:3500", {
          transports: ["websocket", "polling", "flashsocket"],
        });

        dispatch(chatActions.setSocket(socket));

        // "join" is the name of the event that our socket server is listening to
        socket.emit("join", currentUserId);

        // update the status of a chatter to online as soon as they log in
        socket.on("online", (currentUserId: string) => {
          dispatch(chatActions.friendConnect(currentUserId));
        });

        // get all online chatters and update their status once user loads our app
        socket.on("friends", (userIds: string[]) => {
          dispatch(chatActions.getOnlineFriends(userIds));
        });

        socket.on(
          "friendTyping",
          (typing_sender: {
            sender: string;
            receiverid: string;
            typing: boolean;
            conversationId: string;
          }) => {
            dispatch(chatActions.senderTyping(typing_sender));
          }
        );

        // update the status of a chatter to offline as soon as they close the tab (not log out)
        socket.on("offline", (currentUserId: string) => {
          dispatch(chatActions.friendLeave(currentUserId));
        });

        socket.on(
          "receiveMsg",
          ({ _id, conversationId, senderId, message, files, createdAt }) => {
            dispatch(
              chatActions.newArrivalMsg({
                _id,
                conversationId,
                senderId,
                message,
                files,
                createdAt,
                currentUserId,
              })
            );
          }
        );
      });
  }, [currentUserId, dispatch]);
}
