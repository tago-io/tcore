import styled, { css } from "styled-components";
import { fonts } from "../../../../theme";
import * as SelectStyle from "../../../Select/Select.style";
import * as InputStyle from "../../../Input/Input.style";

/**
 * Main style of the component.
 */
export const Container = styled.div<{ disabled: boolean; isForever: boolean }>`
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}

  .form-group-content {
    display: flex;

    ${InputStyle.Container} {
      /* glue the input to the select */
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      flex: none;
      margin-right: -1px;
      text-align: center;
      width: 150px;
    }

    ${SelectStyle.Container} {
      /* glue the select to the input */

      ${(props) =>
        !props.isForever &&
        css`
          /* only apply the top left if there is an input to glue to */
          border-top-left-radius: 0;
        `}

      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      flex: 1;
      height: 33px;
    }
  }
`;

/**
 * Banner style.
 */
export const Banner = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.background2};
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  height: 220px;
  opacity: 1;
  transition: opacity 0.3s, height 0.3s;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.07);
  margin-top: -1px;
  padding: 30px;
  text-align: center;

  .title {
    font-size: ${fonts.medium};
    font-weight: bold;
  }

  .sub-title {
    font-size: ${fonts.default};
    margin-bottom: 10px;
    margin-top: 3px;
  }

  img {
    max-width: 70px;
  }

  a {
    text-decoration: underline;
    cursor: pointer;
  }
`;
