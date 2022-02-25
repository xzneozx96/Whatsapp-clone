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

        .chat_msg {
          margin-bottom: 5px;
          border-radius: 4px;

          &.me {
            width: 100%;
            text-align: right;

            .chat_text {
              background: #005c4b;
              margin-left: auto;
              display: block;
            }
          }

          .chat_text {
            width: fit-content;
            border-radius: 4px;
            padding: 6px 8px;
            background: #202c33;
            font-size: 14px;
            color: #e9edef;
            position: relative;

            .msg_timestamp {
              float: right;
              margin: 7px 0 -5px 10px;
              color: hsla(0, 0%, 100%, 0.6);
              font-size: 11px;
            }
          }

          .chat_files + .chat_files {
            margin-top: 5px;
          }

          .chat_files + .chat_text {
            margin-top: 5px;
          }

          &:last-child {
            margin-bottom: 12px;
          }
        }
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

    footer {
      z-index: 2;
      min-height: 60px;
      background: #202c33;
      display: flex;
      width: 100%;
      padding: 0.75rem;

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
  }
`;
