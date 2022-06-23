import styled from "styled-components";

const Container = styled.div`
  color: black;
  margin-right: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  margin: 20px 0px;

  * {
    color: black;
  }

  > span {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
  }

  section {
    margin-top: 30px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;

    i {
      margin-right: 5px;
      position: relative;
      top: 1px;
    }

    svg {
      opacity: 1;
      fill: black !important;
    }
  }

  h1 {
    margin-top: 0px;
    font-size: 50px;
  }
`;

export { Container };
