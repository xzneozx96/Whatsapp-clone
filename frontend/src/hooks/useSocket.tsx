import { useEffect } from "react";

import { io } from "socket.io-client";
import { chatActions } from "../redux/chat-slice";

export function useSocket(userId: string, dispatch: any) {
  useEffect(() => {
    const socket = io("ws://localhost:3500", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    // "join" is the name of the event that our socket server is listening to
    socket.emit("join", userId);

    // listen to "online" event fired by socket server every time a user visits the app
    socket.on("online", (users) => {
      console.log("Online", users);
      dispatch(chatActions.getOnlineFriends(users));
    });

    socket.on("friends", (users) => {
      console.log("Online Friends", users);
      dispatch(chatActions.getOnlineFriends(users));
    });

    socket.on("offline", (users) => {
      console.log("Offline Friends", users);
    });
  }, [userId, dispatch]);
}
