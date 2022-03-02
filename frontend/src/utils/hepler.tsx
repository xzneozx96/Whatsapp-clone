import { Conversation } from "../interfaces";

export const getRepliedMember = (
  memberId: string,
  currentConversation: Conversation | null
) => {
  return currentConversation?.members.find((member) => member._id === memberId)
    ?.username;
};
