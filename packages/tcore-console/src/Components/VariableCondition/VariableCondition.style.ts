import styled from "styled-components";

/**
 * Container of the item.
 */
export const Container = styled.div<{ error?: boolean }>`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;

  .text {
    font-size: 1.3rem;
    color: ${(props) => props.theme.font2};
    font-weight: bold;
    flex: none;
  }

  .space {
    margin: 0px 5px;
    flex: none;
  }

  .input-container {
    flex: none;
    width: 200px;
  }

  .condition-container {
    flex: 1;
    display: flex;

    select {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      height: 33px;
      margin-right: -1px;
    }

    input {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }
`;
