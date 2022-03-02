import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ReactComponent as UnsentMsgIcon } from "../../images/unsent-msg.svg";
import { Conversation } from "../../interfaces/conversation";
import { SidebarChatStyles } from "../../styles";

export const SidebarChat: React.FC<{
  conversation: Conversation;
}> = ({ conversation }) => {
  const user = useSelector((state: RootState) => state.authReducers.user);

  const online_friends = useSelector(
    (state: RootState) => state.chatReducers.onlineFriends
  );

  const senderTyping = useSelector(
    (state: RootState) => state.chatReducers.senderTyping
  );

  const getFriend = () => {
    return conversation.members.find((member) => member._id !== user.userId);
  };

  const checkOnline = () => {
    let friend = getFriend();

    if (friend) {
      return online_friends.includes(friend._id);
    }
  };

  return (
    <SidebarChatStyles>
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

      <div className={`chat_info ${!conversation.seen ? "unseen" : ""}`}>
        <div className="chat_metadata">
          <h6>{getFriend()?.username}</h6>
          <span>{moment(conversation.updatedAt).calendar()}</span>
        </div>
        {!(
          senderTyping.typing &&
          senderTyping.conversationId === conversation._id
        ) && (
          <div className="recent_msg">
            {!conversation.latestMsg &&
              "You have not sent any message to this person. Let reach out to them now"}

            {conversation.latestMsg && conversation.latestMsg.sent && (
              <span className="msg_content">
                {conversation.latestMsg.message}
              </span>
            )}

            {conversation.latestMsg && !conversation.latestMsg.sent && (
              <div className="msg_removed_holder">
                <UnsentMsgIcon style={{ marginRight: 4, width: 20 }} />
                <span style={{ fontStyle: "italic" }}>
                  {conversation.latestMsg.senderId === user.userId
                    ? "You unsent this message"
                    : "Message removed"}
                </span>
              </div>
            )}

            {!conversation.seen && <span className="unseen_indicator"></span>}
          </div>
        )}

        {senderTyping.typing &&
          senderTyping.conversationId === conversation._id && (
            <div className="typing_indicator">
              {senderTyping.sender} is typing ...
            </div>
          )}
      </div>
    </SidebarChatStyles>
  );
};
