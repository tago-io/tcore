import * as Style from "./ErrorMessage.style";

/**
 */
function ErrorMessage(props: any) {
  const { children } = props;
  return <Style.Container>{children}</Style.Container>;
}

export default ErrorMessage;
