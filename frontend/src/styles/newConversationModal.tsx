import styled from "styled-components";

export const NewConversationModalStyles = styled.div`
  .msg_input {
    padding-right: 1rem;
  }

  .suggestions {
    margin-top: 2rem;

    & > h6 {
      padding-left: 1rem;
      margin-bottom: 10px;
    }

    .item {
      cursor: pointer;
      display: flex;
      min-height: 64px;
      padding: 0 1rem;

      .avatar {
        display: flex;
        align-items: center;
      }

      .user_info {
        margin-left: 1rem;
        flex: 1;
        display: flex;
        justify-content: center;
        flex-direction: column;

        .brief_desc {
          margin-top: 3px;
          font-size: 14px;
          color: #8696a0;
        }
      }

      &:hover {
        background-color: rgba(42, 57, 66, 0.7);
      }
    }
  }
`;
