import styled from "styled-components";

export const SingleMessageStyles = styled.div`
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

        .actions_toggle {
          background: radial-gradient(
            at top right,
            rgba(0, 92, 75, 1) 60%,
            rgba(0, 92, 75, 0) 80%
          );
        }
      }

      .chat_files {
        margin-left: auto;
        justify-content: flex-end;
      }
    }

    .chat_text {
      width: fit-content;
      max-width: 60%;
      border-radius: 4px;
      padding: 6px 8px;
      background: #202c33;
      font-size: 14px;
      color: #e9edef;
      position: relative;

      .msg_content.unsent {
        .unsent_icon {
          color: rgba(233, 237, 239, 0.3);
          margin-right: 4px;
          display: inline-block;
        }

        .unsent_text {
          color: #92a8b5;
          font-style: italic;
        }
      }

      .msg_timestamp {
        float: right;
        margin: 7px 0 -5px 10px;
        color: hsla(0, 0%, 100%, 0.6);
        font-size: 11px;
      }

      .actions_toggle {
        position: absolute;
        right: 0;
        top: 0;
        background: radial-gradient(
          at top right,
          rgba(32, 44, 51, 1) 60%,
          rgba(32, 44, 51, 0) 80%
        );
        color: hsla(0, 0%, 100%, 0.5);
        width: 40px;
        text-align: right;
        transition: all.2s ease-in-out;
        opacity: 0;
        font-size: 28px;
      }

      .actions_toggle.ant-dropdown-open {
        opacity: 1;
      }

      &:hover .actions_toggle {
        opacity: 1;
      }
    }

    .chat_files {
      max-width: 430px;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;

      .chat_text + .chat_text {
        margin-top: 5px;
      }
    }

    .chat_files + .chat_files {
      margin-top: 5px;
    }

    .chat_files + .chat_text {
      margin-top: 5px;
    }

    .document_holder {
      width: 100%;
    }
  }

  &:last-child {
    margin-bottom: 12px;
  }
`;
