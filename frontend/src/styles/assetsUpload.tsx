import styled from "styled-components";

export const AssetsUploadStyles = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  .empty_assets_placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #aebac1;
  }

  .preview_img {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    min-height: 0;

    img {
      height: 100%;
      max-width: 100%;
      object-fit: contain;
      margin-top: 2rem;
      min-height: 0; // make image fit into height of its parent whose display = flex
    }
  }

  .msg_input {
    margin-bottom: 1rem;
    width: 600px;
    margin-left: auto;
    margin-right: auto;

    .send_msg_btn {
      cursor: pointer;
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #00a884;

      i {
        color: #e9edef;
      }

      span {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        background-color: #e9edef;
        color: #243545;
        transform: translate(50%, -30%);
      }
    }
  }
`;
