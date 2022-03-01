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

    .avatar--main {
      position: relative;

      span {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        right: 0;
        bottom: 0;
        background-color: #31a24c;
      }
    }
  }

  .chat_info {
    width: 0; // this line is used to prevent child flex-item from over-expanding its parent
    flex: 1;
    padding-right: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;

    &.unseen {
      .chat_metadata {
        h6 {
          font-weight: 500;
        }

        span {
          font-weight: 600;
          color: #00a884;
        }
      }

      .recent_msg {
        color: #d1d7d8;
        font-weight: 500;
      }
    }

    .chat_metadata {
      display: flex;
      justify-content: space-between;

      h6 {
        font-weight: 400;
      }

      span {
        font-size: 12px;
        color: #8696a0;
      }
    }

    .recent_msg {
      display: flex;
      align-items: center;
      margin-top: 3px;
      font-size: 14px;
      color: #8696a0;

      .msg_content {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-grow: 1;
        min-width: 0;
      }

      .msg_removed_holder {
        flex-grow: 1;
      }

      .unseen_indicator {
        flex: 0 0 12px;
        height: 12px;
        border-radius: 50%;
        background: #00a884;
      }
    }

    .typing_indicator {
      margin-top: 3px;
      font-size: 14px;
      color: #00a884;
      font-weight: 500;
    }
  }
`;
