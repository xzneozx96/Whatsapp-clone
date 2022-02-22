import styled from "styled-components";
import whatsapBg from "../images/whatsap-bg.png";

export const ChatStyles = styled.div`
  flex: 0 0 70%;

  .chat--main {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #0b141a;
    position: relative;

    header {
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

      .empty_space {
        flex: 1 1 auto;
      }

      .cover_img {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-image: url(${whatsapBg});
        background-repeat: repeat;
        background-size: 412.5px 749.25px;
        opacity: 0.06;
      }

      .chat_messages {
        padding: 0 10%;

        .chat_msg {
          padding: 6px 8px;
          margin-bottom: 5px;
          background: #202c33;
          width: fit-content;
          font-size: 14px;
          color: #e9edef;
          border-radius: 4px;

          &.me {
            background: #005c4b;
            margin-left: auto;
          }

          .msg_timestamp {
            float: right;
            margin: 7px 0 -5px 10px;
            color: hsla(0, 0%, 100%, 0.6);
            font-size: 11px;
          }

          &:last-child {
            margin-bottom: 12px;
          }
        }
      }

      .typing_indicator {
        background-color: #202c33;
        width: 40px;
        height: 26px;
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
    }

    footer {
      min-height: 60px;
      background: #202c33;
      display: flex;
      width: 100%;
      padding: 0.75rem 1rem;

      i {
        width: 40px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        color: #8696a0;
      }

      .utils {
        display: flex;
        align-items: center;
      }

      .msg_input {
        display: flex;
        flex: 1;

        i {
          text-align: right;
        }

        .input_field {
          display: flex;
          flex: 1;

          input {
            background: #2a3942;
            border: none;
            color: #e9edef;
          }

          input::placeholder {
            color: #8696a0;
          }
        }
      }
    }
  }
`;
