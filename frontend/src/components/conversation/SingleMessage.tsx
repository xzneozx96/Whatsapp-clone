import { Dropdown, Image, Menu, Modal } from "antd";
import moment from "moment";
import React, { Fragment, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch } from "app/hooks";
import { ReactComponent as EmptyUploadIcon } from "images/empty-upload.svg";
import { ReactComponent as UnsentMsgIcon } from "images/unsent-msg.svg";
import { Conversation, Message } from "interfaces";
import { deleteForCurrentUser, unsend } from "redux/async-thunks";
import { chatActions } from "redux/chat-slice";
import { ReplyStyles, SingleMessageStyles } from "styles";
import { getRepliedMember } from "utils/hepler";

const FnSingleMessage: React.FC<{
  msg: Message;
  currentUser: { userId: string; username: string };
  currentConversation: Conversation | null;
  receiver: { _id: string; username: string };
  socket: Socket | null;
  onReply: (msg: Message) => void;
}> = ({ msg, currentUser, currentConversation, receiver, socket, onReply }) => {
  const API_URL = "http://localhost:3500/";

  console.log('SingleMessage: Re-rendering')

  const dispatch = useAppDispatch();

  const [onActionMsg, setOnActionMsg] = useState<Message>();

  // this function hepls remove Date.now() value from filename created by backend
  const getFileNameForUI = (filename: string) => {
    // convert string into array
    const splitted_filename = filename.split("-");

    // remove the first ele - the Date.now() value from this array
    splitted_filename.shift();

    // convert array back to string
    return splitted_filename.join("-");
  };

  const confirm = async () => {
    Modal.destroyAll();

    // unsend a message
    if (getConfirmText().toLowerCase().includes("unsend")) {
      // 1. update UI
      const result = await dispatch(unsend(onActionMsg?._id || "")).unwrap();

      // 2. notify socket server so that the other member notices there is a message gets unsent
      socket?.emit("unsendMsg", {
        ...result.unsent_msg,
        receiverId: receiver._id,
      });

      return;
    }

    // delete a message for me
    // 1. update UI
    dispatch(chatActions.deleteForMe(onActionMsg));

    // call api
    dispatch(
      deleteForCurrentUser({
        currentUserId: currentUser.userId,
        msgId: msg._id || "",
      })
    );
  };

  const closeModal = () => {
    setOnActionMsg(undefined);
    Modal.destroyAll();
  };

  const getConfirmText = () => {
    // when user wants to delete his/her own message
    if (currentUser.userId === onActionMsg?.senderId) {
      return "Unsend for everyone";
    }

    // when user wants to delete message from the other
    return "Delete for me";
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Delete Message ?",
      okText: getConfirmText(),
      centered: true,
      cancelText: "Cancel",
      okButtonProps: {
        className: "primary_btn btn",
      },
      cancelButtonProps: {
        className: "ghost_btn btn",
      },
      onOk: confirm,
      onCancel: closeModal,
    });
  };

  const actions = (
    <Menu>
      <Menu.Item key="1" onClick={() => onReply(onActionMsg!)}>
        Reply
      </Menu.Item>
      <Menu.Item key="2" onClick={() => confirmDelete()}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const handleScrollToReplied = (msgId: string) => {
    const msg_element = document.getElementById(msgId);

    msg_element?.classList.add("glowing");

    msg_element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <SingleMessageStyles
      className={msg.senderId === currentUser.userId ? "me" : ""}
      id={msg._id}
    >
      <div className="chat_msg">
        {/* UI for messages that contain files */}
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
                        <div className="msg_content">
                          <a href={API_URL + file.path}>
                            {getFileNameForUI(file.fileName)}
                          </a>
                        </div>
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
        )}

        {/* UI for showing sent messages  */}
        {msg.message.length > 0 && msg.sent && (
          <div className="chat_text">
            {msg.replyTo && (
              <ReplyStyles>
                <div
                  className="reply_wrapper"
                  onClick={() => {
                    handleScrollToReplied(msg.replyTo?._id!);
                  }}
                >
                  <span className="decorator"></span>
                  <div className="reply_main">
                    <div className="reply_to">
                      {getRepliedMember(
                        msg.replyTo.senderId,
                        currentConversation
                      )}
                    </div>
                    <div className="replied_content">{msg.replyTo.message}</div>
                  </div>
                </div>
              </ReplyStyles>
            )}

            <span className="msg_content">{msg.message}</span>

            <span className="msg_timestamp">
              {moment(msg.createdAt).calendar()}
            </span>

            <Dropdown
              overlayClassName="message_actions--dropdown"
              overlay={actions}
              trigger={["click"]}
            >
              <i
                className="bx bx-chevron-down actions_toggle"
                onClick={() => setOnActionMsg(msg)}
              ></i>
            </Dropdown>
          </div>
        )}

        {/* place holder for unsent messages */}
        {msg.message.length > 0 && !msg.sent && (
          <div className="chat_text">
            <span className="msg_content unsent">
              <span className="unsent_icon">
                <UnsentMsgIcon />
              </span>
              <span className="unsent_text">
                {msg.senderId === currentUser.userId
                  ? "You unsent this message"
                  : "Message removed"}
              </span>
            </span>

            <span className="msg_timestamp">
              {moment(msg.createdAt).calendar()}
            </span>
          </div>
        )}
      </div>
    </SingleMessageStyles>
  );
};

export const SingleMessage = React.memo(FnSingleMessage)