import styled from "styled-components";

export const IntroStyles = styled.div`
  flex: 0 0 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 28px;
  padding-bottom: 28px;
  background-color: #222e35;
  border-left: 1px solid rgba(134, 150, 160, 0.15);
  border-bottom: 6px solid rgb(0, 128, 105);

  .intro--main {
    max-width: 600px;
    text-align: center;

    h2 {
      margin-top: 2rem;
      color: rgba(233, 237, 239, 0.88);
    }

    p {
      color: #8696a0;
      margin-top: 1.5rem;
      margin-bottom: 0;
    }
  }
`;
