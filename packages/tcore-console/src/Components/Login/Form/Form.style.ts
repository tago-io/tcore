import styled from "styled-components";

const Container = styled.div`
  display: flex;
  right: 80px;
  background: white;
  border-radius: 20px;
  width: 600px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 560px;

  h1 {
    font-size: 30px;
    color: black;
    margin-bottom: 20px;
  }

  input {
  }

  button {
    width: 100%;
    height: 40px;
  }

  svg,
  i {
    height: auto;
  }

  svg,
  svg * {
    fill: black !important;
    opacity: 1 !important;
  }
`;

export { Container };
