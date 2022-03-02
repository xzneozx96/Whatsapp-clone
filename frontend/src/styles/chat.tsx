import styled from "styled-components";
import whatsapBg from "../images/whatsap-bg.png";

export const ChatStyles = styled.div`
  flex: 0 0 70%;
  overflow: hidden; // prevent child items over-expand its parent

  .chat--main {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #0b141a;
    position: relative;

    .cover_img {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-image: url(${whatsapBg});
      background-repeat: repeat;
      background-size: 412.5px 749.25px;
      opacity: 0.06;
      pointer-events: none;
    }

    header {
      z-index: 2;
      padding: 0 1rem;
      background: #202c33;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      box-shadow: 0 1px 3px rgba(11, 20, 26, 0, 4);
      border-left: 1px solid rgba(134, 150, 160, 0.15);

      .avatar {
        padding-right: 1rem;

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

      .user_info {
        flex-grow: 1;

        span {
          font-size: 14px;
          color: #8696a0;
        }
      }

      .chat_action {
        i {
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
        }
      }
    }

    .chat_body {
      position: relative;
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      border-left: 1px solid rgba(233, 237, 239, 0.12);

      .empty_space {
        flex: 1 1 auto;
        min-height: 100px;
      }

      .scroll_bottom {
        width: 40px;
        height: 40px;
        position: sticky;
        margin-right: 14px;
        border-radius: 50%;
        align-self: flex-end;
        bottom: 24px;
        line-height: 58px;
        text-align: center;
        background-color: #202c33;

        i {
          font-size: 2rem;
          color: #798287;
        }
      }

      .chat_messages {
        padding: 0 10%;
      }

      .typing_indicator {
        background-color: #202c33;
        width: 48px;
        height: 28px;
        margin-bottom: 12px;
        display: block;
        border-radius: 30% / 50%;

        &--bubbles {
          text-align: center;

          span {
            display: inline-block;
            background-color: #8696a0;
            width: 6px;
            height: 6px;
            border-radius: 100%;
            margin-right: 2px;
            animation: bob 1.5s infinite;

            // SAFARI GLITCH
            &:nth-child(1) {
              animation-delay: -0.5s;
            }
            &:nth-child(2) {
              animation-delay: -0.35s;
            }
            &:nth-child(3) {
              animation-delay: -0.2s;
              margin-right: 0;
            }
          }

          @keyframes bob {
            10% {
              transform: translateY(-5px);
              background-color: #9e9da2;
            }

            50% {
              transform: translateY(0);
              background-color: #8696a0;
            }
          }
        }
      }

      .close_upload {
        position: absolute;
        top: 1rem;
        left: 1rem;
        font-size: 2rem;
        z-index: 10;
      }
    }

    .reply_empty_space {
      height: 0;
      transition: 0.3s ease-in-out;

      &.show {
        height: 64px;
      }
    }

    footer {
      min-height: 60px;
      z-index: 2;
      width: 100%;
      position: relative;
      border-left: 1px solid rgba(134, 150, 160, 0.15);

      .send_msg {
        display: flex;
        z-index: 1;
        position: relative;
        padding: 0.75rem;
        background: #202c33;

        i {
          width: 40px;
          height: 40px;
          line-height: 40px;
          cursor: pointer;
          color: #8696a0;
          text-align: center;
          border-radius: 50%;

          &:hover {
            background-color: hsla(0, 0%, 100%, 0.1);
          }
        }

        .utils {
          display: flex;
          align-items: center;
        }

        .msg_input {
          flex: 1;
        }
      }

      .reply_wrapper {
        margin-left: 1.5rem;

        .reply_main {
          margin-right: 1rem;
          background: #111b21;
        }
      }
    }
  }
`;

export const ReplyStyles = styled.div`
  .reply_msg {
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: 0.5rem;
    bottom: 100%;
    background: #202c33;
    transition: 0.3s ease-in-out;
    transform: translateY(100%);
    z-index: 0;

    &.replying {
      transform: translateY(0%);
    }

    .cancel_reply {
      width: 40px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      color: #8696a0;
      text-align: center;
      border-radius: 50%;
      font-size: 2rem;
      margin-right: 12px;

      &:hover {
        background-color: hsla(0, 0%, 100%, 0.1);
      }
    }
  }

  .reply_wrapper {
    flex: 1;
    display: flex;

    .decorator {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      background: #06cf9c;
      width: 4px;
    }

    .reply_main {
      padding: 6px 12px;
      flex-grow: 1;
      border-radius: 5px;
      min-height: 56px;

      .reply_to {
        font-weight: 500;
        color: #06cf9c;
      }

      .replied_content {
        color: hsla(0, 0%, 100%, 0.6);
        max-width: 500px;
      }
    }
  }
`;
