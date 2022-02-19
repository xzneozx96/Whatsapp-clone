import { useEffect } from "react";

import { io } from "socket.io-client";

export function useSocket(user: any) {
  useEffect(() => {
    const socket = io("ws://localhost:3500", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    // "join" is the name of the event that our socket server is listening to
    socket.emit("join", user);

    socket.on("typing", (user) => {
      console.log("User is typing", user);
    });
  }, [user]);
}
