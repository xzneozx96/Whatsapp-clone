import styled from "styled-components";

export const SidebarChatStyles = styled.div`
  & + & {
    .chat_info {
      border-top: 1px solid rgba(134, 150, 160, 0.15);
    }
  }

  &:hover {
    background: rgb(32, 44, 51);
  }

  min-height: 72px;
  display: flex;
  position: relative;
  cursor: pointer;

  .avatar {
    padding: 0 1rem;
    display: flex;
    align-items: center;
  }

  .chat_info {
    width: 0; // this line is used to prevent child flex-item from over-expanding its parent
    flex: 1;
    padding-right: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .chat_metadata {
      display: flex;
      justify-content: space-between;

      span {
        font-size: 12px;
        color: #8696a0;
      }
    }

    .recent_msg {
      /* wrap text into 1 line then show ellipsis for overflowing characters */
      width: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      /* end of the process */

      margin-top: 3px;
      font-size: 14px;
      color: #8696a0;
    }
  }
`;
