import { Avatar, Modal } from "antd";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "app/hooks";
import { User } from "interfaces";
import { newConversation, searchUsers } from "redux/async-thunks";
import { NewConversationModalStyles } from "styles";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

export const NewConversationModal: React.FC<{
  currentUser: { userId: string; username: string };
  socket: Socket | null;
  closeModal: () => void;
}> = (props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [members, setMembers] = useState<User[]>([]);
  const debouncer = useRef<any>(); // value held by ref won't be clear when component re-renders

  useEffect(() => {
    dispatch(searchUsers({searchName: "", currentUserId: props.currentUser.userId}))
      .unwrap()
      .then((result) => {
        setMembers(result.users);
      });
  }, [dispatch, props.currentUser]);

  const handleOk = () => {
    setIsModalVisible(false);
    props.closeModal();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    props.closeModal();
  };

  const deboundSearch = (event: any) => {
    let search_value = event.target.value;

    if (debouncer.current) clearTimeout(debouncer.current);

    debouncer.current = setTimeout(async () => {
      const result = await dispatch(searchUsers({
        searchName: search_value,
        currentUserId: props.currentUser.userId
      })).unwrap();

      setMembers(result.users);
    }, 400);
  };

  const handleCreateConversation = (receiverId: string) => {
    dispatch(
      newConversation({
        senderId: props.currentUser.userId,
        receiverId: receiverId,
      })
    )
      .unwrap()
      .then((result) => {
        // notify the socket server every time new message sent
        props.socket?.emit("newConversation", {
          ...result.new_conversation,
        });

        // close modal
        handleCancel();

        // redirect to the newly created conversation
        navigate(result.new_conversation._id);
      });
  };

  return (
    <Modal
      title="New Conversation"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <button
          key={"cancel-search"}
          className="btn primary_btn"
          onClick={handleCancel}
        >
          Cancel
        </button>,
      ]}
    >
      <NewConversationModalStyles>
        <div className="msg_input">
          <div className="input_field">
            <input
              type="text"
              placeholder="Search by name ..."
              className="form-control"
              onChange={(event: any) => {
                deboundSearch(event);
              }}
            />
          </div>
        </div>

        <div className="suggestions">
          {members.length === 0 && <h6>No users found</h6>}

          {members.length > 0 && <h6>Suggestions</h6>}
          {members.length > 0 &&
            members.map((mem) => (
              <div
                className="item"
                key={mem._id}
                onClick={() => {
                  handleCreateConversation(mem._id);
                }}
              >
                <div className="avatar">
                  <Avatar
                    size={40}
                    style={{ backgroundColor: "#6a7175", color: "#e9edef" }}
                  >
                    {mem.username[0].toUpperCase()}
                  </Avatar>
                </div>

                <div className="user_info">
                  <h6 className="user_name">{mem.username}</h6>
                  <div className="brief_desc">
                    Brief Introduction about this person
                  </div>
                </div>
              </div>
            ))}
        </div>
      </NewConversationModalStyles>
    </Modal>
  );
};
