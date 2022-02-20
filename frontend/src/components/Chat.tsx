import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { Message } from "../interfaces/message";
import {
  getConversationMessages,
  getCurrentConversation,
  sendMsg,
} from "../redux/chat-slice";
import { ChatStyles } from "../styles";

export function Chat() {
  const userId = localStorage.getItem("userID") || "";
  const dispatch = useAppDispatch();

  const { conversationId } = useParams<string>();

  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  // const [newArrivalMsg, setNewArrivalMsg] = useState<Message | null>(null);

  const socket = useSelector((state: RootState) => state.chatReducers.socket);
  const currentConversation = useSelector(
    (state: RootState) => state.chatReducers.currentChat
  );
  const online_friends = useSelector(
    (state: RootState) => state.chatReducers.onlineFriends
  );
  const newArrivalMsg = useSelector(
    (state: RootState) => state.chatReducers.newArrivalMsg
  );

  useEffect(() => {
    dispatch(getCurrentConversation(conversationId || ""));
  }, [dispatch, conversationId]);

  useEffect(() => {
    dispatch(getConversationMessages(conversationId || ""))
      .unwrap()
      .then((result) => {
        setMessages(result.conversation_messages);
      });
  }, [dispatch, conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getFriend = () => {
    return currentConversation?.members.find((member) => member !== userId);
  };

  const checkOnline = () => {
    let friend = getFriend();

    if (friend) {
      return online_friends.includes(friend);
    }
  };

  useEffect(() => {
    // if new msg arrives and belongs to the current conversation update the chat history - messages
    if (
      newArrivalMsg &&
      currentConversation?.members.includes(newArrivalMsg.senderId)
    ) {
      setMessages((prev) => [...prev, newArrivalMsg]);
    }
  }, [newArrivalMsg, currentConversation, conversationId]);

  const handleSendMsg = async () => {
    const new_msg = {
      conversationId: conversationId || "",
      senderId: userId,
      message: newMsg,
    };

    // const receiverId =
    //   currentConversation?.members.find((mem) => mem !== userId) || "";

    // socket?.emit("sendMsg", {
    //   senderId: userId,
    //   receiverId,
    //   message: newMsg,
    // });

    const result = await dispatch(sendMsg(new_msg)).unwrap();
    // .unwrap()
    // .then((result) => {
    //   socket?.emit("sendMsg", {
    //     ...result,
    //     receiverId,
    //   });

    //   console.log(result);

    //   setMessages([...messages, result.new_msg]);
    //   setNewMsg("");
    // });

    // notify the socket server every time new message sent
    const receiverId =
      currentConversation?.members.find((mem) => mem !== userId) || "";

    socket?.emit("sendMsg", {
      ...result.new_msg,
      receiverId,
    });

    console.log({ ...result.new_msg });

    setMessages([...messages, result.new_msg]);
    setNewMsg("");
  };

  const sendMsgOnEnter = (event: any) => {
    if (newMsg.length > 0 && event.code === "Enter") {
      handleSendMsg();
      setNewMsg("");

      return;
    }
  };

  return (
    <ChatStyles>
      <div className="chat--main">
        <header>
          <div className="avatar">
            <div className="avatar--main">
              <svg viewBox="0 0 212 212" width="40" height="40">
                <path
                  fill="#6a7175"
                  d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"
                ></path>
                <g fill="#FFF">
                  <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                </g>
              </svg>
              {checkOnline() && <span className="online_indicator"></span>}
            </div>
          </div>

          <div className="user_info">
            <h6>{getFriend()}</h6>
            <span>{checkOnline() ? "online" : "offline"}</span>
          </div>

          <div className="chat_action">
            <i className="bx bx-search"></i>
            <i className="bx bx-dots-vertical-rounded"></i>
          </div>
        </header>

        <div className="chat_body">
          <div className="cover_img"></div>
          <div className="empty_space"></div>
          <div className="chat_messages position-relative">
            {messages &&
              messages.map((msg) => (
                <div
                  className={`chat_msg ${msg.senderId === userId ? "me" : ""}`}
                  key={msg._id}
                  ref={scrollRef}
                >
                  <span className="msg_content">{msg.message}</span>
                  <span className="msg_timestamp">
                    {moment(msg.createdAt).calendar()}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <footer>
          <div className="utils">
            <i className="bx bx-smile"></i>
            <i className="bx bx-link-alt"></i>
          </div>

          <div className="msg_input">
            <div className="input_field">
              <input
                type="text"
                placeholder="Enter your message"
                className="form-control"
                onChange={(event: any) => {
                  setNewMsg(event.target.value);
                }}
                onKeyUp={sendMsgOnEnter}
                value={newMsg}
              />
            </div>
            <i className="bx bx-send" onClick={handleSendMsg}></i>
          </div>
        </footer>
      </div>
    </ChatStyles>
  );
}
