import { Dropdown, Menu, Tooltip, Image } from "antd";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import moment from "moment";
import { Fragment, RefObject, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { ReactComponent as AssetUploadIcon } from "../images/asset-upload.svg";
import { ReactComponent as FileUploadIcon } from "../images/file-upload.svg";
import { ReactComponent as EmptyUploadIcon } from "../images/empty-upload.svg";
import { Message } from "../interfaces/message";
import {
  chatActions,
  getConversationPaginatedMessages,
  getCurrentConversation,
  sendMsg,
} from "../redux/chat-slice";
import { ChatStyles } from "../styles";
import { openInfoNotification } from "../utils/antdNoti";
import { AssetsUpload } from "./AssetsUpload";

export function Chat() {
  const API_URL = "http://localhost:3500/";

  const dispatch = useAppDispatch();

  const conversationId = useParams<string>()?.conversationId || "";

  // const latesMsgRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const msgInput = useRef() as RefObject<HTMLInputElement>;
  const chatBodyRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [loading, setShowLoading] = useState(false);
  const [scrollUp, setScrollUp] = useState(0);
  const [uploadFileType, setUploadFileType] = useState("");
  // const [dropdownVisible, setDropdownVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const user = useSelector((state: RootState) => state.authReducers.user);
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
  const scrollBottom = useSelector(
    (state: RootState) => state.chatReducers.scrollBottom
  );
  const senderTyping = useSelector(
    (state: RootState) => state.chatReducers.senderTyping
  );
  const pagination = useSelector(
    (state: RootState) => state.chatReducers.pagination
  );
  const receiver = currentConversation?.members.find(
    (mem) => mem._id !== user.userId
  );

  useEffect(() => {
    dispatch(getCurrentConversation(conversationId || ""));
  }, [dispatch, conversationId]);

  useEffect(() => {
    dispatch(
      getConversationPaginatedMessages({
        conversationId: conversationId || "",
        page: 1,
      })
    )
      .unwrap()
      .then((result) => {
        setMessages(result.conversation_messages.reverse());
      });
  }, [dispatch, conversationId]);

  useEffect(() => {
    setTimeout(() => {
      manualScroll(chatBodyRef.current.scrollHeight); // scroll all the way down to bottom of the viewport height
    }, 200);
  }, [scrollBottom]);

  useEffect(() => {
    // this useEffect is to prevent scrollbar stick to the top once user fetch old messages with infinite scroll
    setTimeout(() => {
      manualScroll(Math.ceil(chatBodyRef.current.scrollHeight * 0.05)); // scroll all the way down to bottom of the viewport height: ;
    }, 200);
  }, [scrollUp]);

  useEffect(() => {
    const { scrollTop, clientHeight, scrollHeight } = chatBodyRef.current;
    if (newArrivalMsg.senderId !== "") {
      if (
        newArrivalMsg.senderId !== "" &&
        scrollTop + clientHeight > scrollHeight - 50
      ) {
        dispatch(chatActions.manualScrollBottom());
      } else {
        openInfoNotification("You've got a new messasge");
      }
    }
  }, [newArrivalMsg, dispatch]);

  useEffect(() => {
    // if new msg arrives and belongs to the current conversation update the chat history - messages
    if (
      newArrivalMsg &&
      currentConversation?.members.some(
        (mem) => mem._id === newArrivalMsg.senderId
      )
    ) {
      setMessages((prev) => [...prev, newArrivalMsg]);
    }
  }, [newArrivalMsg, currentConversation]);

  const getFriend = () => {
    return currentConversation?.members.find(
      (member) => member._id !== user.userId
    );
  };

  const checkOnline = () => {
    let friend = getFriend();

    if (friend) {
      return online_friends.includes(friend._id);
    }
  };

  const selectEmoji = (emoji: any) => {
    const starting_point = msgInput.current!.selectionStart || 0;
    const ending_point = msgInput.current?.selectionEnd || 0;

    const emoji_length = emoji.native.length;
    const msgInput_value = msgInput.current?.value;

    setNewMsg(
      msgInput_value?.substring(0, starting_point) +
        emoji.native +
        msgInput_value?.substring(ending_point, msgInput_value.length)
    );

    // re-focus on the input field after selecting an emoji
    msgInput.current?.focus();

    // set cursor to the end of the message
    msgInput.current!.selectionEnd = emoji_length + ending_point;
  };

  const manualScroll = (value: number) => {
    chatBodyRef.current.scrollTop = value;
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = chatBodyRef.current;

    // show "scroll-to-bottom" button
    if (scrollTop + clientHeight < scrollHeight - 50) {
      setShowScrollBottom(true);
    } else {
      setShowScrollBottom(false);
    }

    // fetch old messages with infinite scroll
    if (scrollTop === 0 && pagination?.hasNextPage) {
      console.log("fetching old messages");

      setShowLoading(true);

      dispatch(
        getConversationPaginatedMessages({
          conversationId: conversationId || "",
          page: pagination!.nextPage,
        })
      )
        .unwrap()
        .then((result) => {
          // hide loading indicator
          setShowLoading(false);

          // make scrollbar little bit offset from top
          setScrollUp(scrollUp + 1);

          const old_messages = result.conversation_messages.reverse();

          // update current messages
          setMessages([...old_messages, ...messages]);
        });
    } else {
      return;
    }
  };

  const handleSendMsg = async () => {
    const new_msg = {
      conversationId: conversationId || "",
      senderId: user.userId || "",
      message: newMsg,
    };

    const result = await dispatch(sendMsg(new_msg)).unwrap();

    // notify the socket server every time new message sent
    socket?.emit("sendMsg", {
      ...result.new_msg,
      receiverId: receiver!._id,
    });

    setMessages([...messages, result.new_msg]);
    setNewMsg("");
    setShowEmojiPicker(false);
    manualScroll(chatBodyRef.current.scrollHeight);
  };

  const sendMsgOnEnter = (event: any) => {
    // emit typing event to socket server
    const receiver = currentConversation?.members.find(
      (mem) => mem._id !== user.userId
    );

    const msgInput_value = msgInput.current?.value;

    if (msgInput_value!.length > 0) {
      const typing_sender = {
        sender: user.username,
        receiverId: receiver?._id,
        typing: true,
        conversationId,
      };
      socket?.emit("meTyping", typing_sender);
    }

    if (msgInput_value!.length === 0) {
      const typing_sender = {
        sender: user.username,
        receiverId: receiver?._id,
        typing: false,
        conversationId,
      };
      socket?.emit("meTyping", typing_sender);
    }

    // send message when press enter
    if (newMsg.length > 0 && event.code === "Enter") {
      handleSendMsg();
      setNewMsg("");
      const typing_sender = {
        sender: user.username,
        receiverId: receiver?._id,
        typing: false,
        conversationId,
      };
      socket?.emit("meTyping", typing_sender);

      return;
    }
  };

  // this function gets executed after users send files successfully from AssetUpload component
  const updateMessages = (new_msg: Message) => {
    setMessages([...messages, new_msg]);

    // wait for UI to update then scroll to bottom once users finish uploading then get redirect to chat messages
    setTimeout(() => {
      manualScroll(chatBodyRef.current.scrollHeight);
    }, 300);
  };

  const menu = (
    <Menu>
      <Menu.Item key="AssetUploadIcon">
        <Tooltip placement="right" title="Images and Videos">
          <AssetUploadIcon
            onClick={() => {
              setUploading(true);
              setUploadFileType("image/*, video/*");
            }}
          />
        </Tooltip>
      </Menu.Item>

      <Menu.Item key="FileUploadIcon">
        <Tooltip placement="right" title="Documents">
          <FileUploadIcon
            onClick={() => {
              setUploading(true);
              setUploadFileType(".docx, .doc, .xlxs, .xls, .ppt, .pptx, .pdf");
            }}
          />
        </Tooltip>
      </Menu.Item>
    </Menu>
  );

  // this function hepls remove Date.now() value from filename created by backend
  const getFileNameForUI = (filename: string) => {
    // convert string into array
    const splitted_filename = filename.split("-");

    // remove the first ele - the Date.now() value from this array
    splitted_filename.shift();

    // convert array back to string
    return splitted_filename.join("-");
  };

  // make dropdown stay opened when click on its item
  // const handleVisibleChange = (flag: boolean) => {
  //   setDropdownVisible(flag);
  // };

  return (
    <ChatStyles>
      <div className="chat--main">
        <div className="cover_img"></div>

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
            <h6>{getFriend()?.username}</h6>
            <span>{checkOnline() ? "online" : "offline"}</span>
          </div>

          <div className="chat_action">
            <i className="bx bx-search"></i>
            <i className="bx bx-dots-vertical-rounded"></i>
          </div>
        </header>

        <div className="chat_body" onScroll={handleScroll} ref={chatBodyRef}>
          {loading && (
            <i
              style={{
                color: "#00a884",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: "20px",
                fontSize: "2rem",
              }}
              className="bx bx-loader-alt bx-spin"
            ></i>
          )}

          {!uploading && (
            <Fragment>
              <div className="empty_space"></div>

              <div className="chat_messages position-relative">
                {messages &&
                  messages.map((msg) => (
                    <div
                      className={`chat_msg ${
                        msg.senderId === user.userId ? "me" : ""
                      }`}
                      key={msg._id}
                    >
                      {msg.files && msg.files.length > 0 && (
                        <div className="chat_files">
                          <Image.PreviewGroup>
                            {msg.files.map((file) => (
                              <Fragment key={file.fileName}>
                                {/* UI for viewing images */}
                                {file.fileType.includes("image") && (
                                  <Image
                                    style={{
                                      borderRadius: 6,
                                      padding: 3,
                                      backgroundColor: "#005c4b",
                                      height: 140,
                                      width: 140,
                                      objectFit: "cover",
                                    }}
                                    src={API_URL + file.path}
                                    alt="file"
                                  />
                                )}

                                {/* UI for viewing videos */}
                                {file.fileType.includes("video") && (
                                  <video
                                    controls
                                    style={{
                                      borderRadius: 6,
                                      maxHeight: 400,
                                      width: 300,
                                    }}
                                    src={API_URL + file.path}
                                  ></video>
                                )}

                                {/* UI for downloading files (no preview) */}
                                {file.fileType.includes("application") && (
                                  <div className="document_holder">
                                    <div className="chat_text">
                                      <EmptyUploadIcon
                                        style={{
                                          marginRight: 10,
                                          width: 20,
                                          height: "auto",
                                        }}
                                      />
                                      <span className="msg_content">
                                        <a href={API_URL + file.path}>
                                          {getFileNameForUI(file.fileName)}
                                        </a>
                                      </span>
                                      <span className="msg_timestamp">
                                        {moment(msg.createdAt).calendar()}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Fragment>
                            ))}
                          </Image.PreviewGroup>
                        </div>

                        // download documents
                      )}

                      {msg.message.length > 0 && (
                        <div className="chat_text">
                          <span className="msg_content">{msg.message}</span>
                          <span className="msg_timestamp">
                            {moment(msg.createdAt).calendar()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                {senderTyping.typing &&
                  senderTyping.conversationId === conversationId && (
                    <div className="typing_indicator">
                      <div className="typing_indicator--bubbles">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
              </div>

              {showScrollBottom && (
                <div
                  className="scroll_bottom"
                  onClick={() => {
                    dispatch(chatActions.manualScrollBottom());
                  }}
                >
                  <i className="bx bx-chevron-down"></i>
                </div>
              )}
            </Fragment>
          )}

          {uploading && (
            <Fragment>
              <i
                className="bx bx-x close_upload"
                onClick={() => {
                  setUploading(false);
                  setTimeout(() => {
                    manualScroll(chatBodyRef.current.scrollHeight);
                  }, 300);
                }}
              ></i>
              <AssetsUpload
                onClose={() => {
                  setUploading(false);
                }}
                fileSent={(new_msg: Message) => {
                  updateMessages(new_msg);
                }}
                senderId={user.userId}
                receiverId={receiver?._id || ""}
                conversationId={conversationId}
                uploadFileType={uploadFileType}
                currentConversation={currentConversation}
              />
            </Fragment>
          )}
        </div>

        {!uploading && (
          <footer>
            <div className="utils">
              <i
                className="bx bx-smile"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                }}
              ></i>
              <Dropdown
                // onVisibleChange={handleVisibleChange}
                // visible={dropdownVisible}
                overlay={menu}
                trigger={["click"]}
                placement="topCenter"
              >
                <i className="bx bx-link-alt"></i>
              </Dropdown>
            </div>

            {showEmojiPicker && (
              <Picker
                theme="dark"
                title="Pick your emoji…"
                emoji="point_up"
                style={{
                  position: "absolute",
                  bottom: "64px",
                  right: "0",
                  width: "100%",
                }}
                onSelect={selectEmoji}
              />
            )}

            <div className="msg_input">
              <div className="input_field">
                <input
                  ref={msgInput}
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
        )}
      </div>
    </ChatStyles>
  );
}
