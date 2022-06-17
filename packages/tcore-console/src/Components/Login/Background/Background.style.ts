import styled from "styled-components";

const Container = styled.div<any>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  max-width: 100%;
  background: rgb(15, 15, 15);
  position: fixed;

  .gradient {
    position: fixed;
    right: 0px;
    top: 0px;
    bottom: 0px;
    width: 800px;
    background: linear-gradient(to left, black, black, transparent);
  }

  .inner {
    display: flex;
    transform: rotate(45deg);
    width: 1650px;
    margin-left: -150px;
    margin-top: -110px;
    /* background: blue; */
  }

  .row {
    display: flex;
    justify-content: flex-end;
    flex: none;
    width: 600px;
    margin-top: 350px;
  }

  .col {
    display: flex;
    flex-direction: column;
    flex: none;
  }
`;

const Device = styled.div`
  width: 600px;
  height: 600px;
  background: linear-gradient(black, transparent);
  opacity: 0.8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  i svg {
    fill: white;
    opacity: 0.04;
  }
`;

const Small = styled.div`
  width: 150px;
  height: 150px;
  background: linear-gradient(transparent, black);
  opacity: 0.8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;

  i svg {
    fill: white;
    opacity: 0.04;
  }
`;

const Bucket = styled.div`
  width: 1000px;
  height: 1000px;
  background: linear-gradient(black, black, transparent);
  opacity: 0.8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  flex: none;

  i svg {
    fill: white;
    opacity: 0.04;
  }
`;

export { Bucket, Small, Container, Device };
