import styled from "styled-components";

const Container = styled.div`
  color: white;
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
    color: white;
  }

  > span {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.6);
  }

  section {
    margin-top: 30px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;

    i {
      margin-right: 5px;
      position: relative;
      top: 1px;
    }

    svg {
      opacity: 1;
      fill: white !important;
    }
  }

  h1 {
    margin-top: 0px;
    font-size: 50px;
  }

  .trusted-by {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0px;
    opacity: 0.25;

    .msg {
      display: flex;
      align-items: center;
      position: relative;
      justify-content: center;
      margin-bottom: 15px;
      width: 600px;

      div {
        width: 140px;
        height: 1px;
        background: white;
        opacity: 0.5;
      }
      span {
        font-size: 16px;
        margin: 0px 10px;
      }
    }

    .logos {
      display: flex;
    }

    svg {
      height: auto;
      fill: white !important;
      width: 80px;
      margin: 0px 10px;
    }
    svg * {
      fill: white !important;
    }
  }
`;

export { Container };
