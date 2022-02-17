import styled from "styled-components";

export const SidebarStyles = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 0 0 30%;

  .sidebar_header {
    padding: 10px 16px;
    background: #202c33;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .avatar {
      display: flex;
      align-items: center;

      .user_info {
        margin-left: 1rem;
      }
    }
  }

  .sidebar_search {
    padding: 10px 16px;
    border-bottom: 1px solid rgba(134, 150, 160, 0.15);

    .input_field {
      position: relative;
      padding: 4px 0;

      input {
        height: 100%;
        background-color: transparent;
        border: none;
        background-color: #202c33;
        color: #e9edef;
        padding-left: 3rem;
      }

      input::placeholder {
        color: #8696a0;
        font-size: 14px;
      }

      i {
        color: #8696a0;
        font-size: 20px;
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
      }
    }
  }
`;
