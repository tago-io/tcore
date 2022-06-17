import { useRef, KeyboardEvent, useCallback } from "react";
import { Button, EIcon, FormGroup, Input } from "../../..";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import InputPassword from "../../InputPassword/InputPassword";
import * as Style from "./Form.style";

/**
 * Props.
 */
interface IFormProps {
  loading?: boolean;
  data: any;
  error: any;
  onSignIn: () => void;
  onSignUp: () => void;
  onChangeData: (newData: any) => void;
  signUpMode?: boolean;
}

/**
 */
function Form(props: IFormProps) {
  const { data, error, loading, onSignUp, onSignIn, onChangeData, signUpMode } = props;
  const passwordRef = useRef<HTMLInputElement>(null);

  /**
   * Called when the username input receives a keydown event.
   */
  const onUsernameKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      passwordRef?.current?.focus();
    }
  }, []);

  /**
   * Called when the password input receives a keydown event.
   */
  const onPasswordKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSignIn();
      }
    },
    [onSignIn]
  );

  /**
   */
  const renderSignIn = () => {
    return (
      <>
        <h1>Sign in</h1>

        <div style={{ width: "60%" }}>
          <FormGroup label="Username" icon={EIcon["user-alt"]}>
            <Input
              autoFocus
              disabled={loading}
              error={error?.username}
              onChange={(e) => onChangeData({ ...data, username: e.target.value })}
              value={data.username || ""}
              onKeyDown={onUsernameKeyDown}
            />
          </FormGroup>

          <FormGroup label="Password" icon={EIcon.eye}>
            <InputPassword
              disabled={loading}
              error={error?.password}
              onChange={(e) => onChangeData({ ...data, password: e.target.value })}
              value={data.password || ""}
              onKeyDown={onPasswordKeyDown}
              inputRef={passwordRef}
            />
          </FormGroup>

          {error?.message && (
            <FormGroup>
              <ErrorMessage style={{ textAlign: "left", display: "flex", marginTop: 0 }}>
                {error?.message}
              </ErrorMessage>
            </FormGroup>
          )}

          <FormGroup addMarginBottom={false}>
            <Button disabled={loading} onClick={onSignIn} color="black">
              Sign in
            </Button>
          </FormGroup>
        </div>
      </>
    );
  };

  /**
   */
  const renderSignUp = () => {
    return (
      <>
        <h1>Sign up</h1>

        <div style={{ width: "60%" }}>
          <FormGroup required label="Full Name" icon={EIcon["user-alt"]}>
            <Input
              autoFocus
              disabled={loading}
              error={error?.name}
              onChange={(e) => onChangeData({ ...data, name: e.target.value })}
              value={data.name || ""}
            />
          </FormGroup>

          <FormGroup
            tooltip="This is the username that you will use to login"
            required
            label="Username"
            icon={EIcon["user-alt"]}
          >
            <Input
              disabled={loading}
              error={error?.username}
              onChange={(e) => onChangeData({ ...data, username: e.target.value })}
              value={data.username || ""}
              placeholder="This will be used to login"
            />
          </FormGroup>

          <FormGroup
            tooltip="The password cannot be changed later on"
            required
            label="Password"
            icon={EIcon.key}
          >
            <InputPassword
              disabled={loading}
              error={error?.password}
              onChange={(e) => onChangeData({ ...data, password: e.target.value })}
              value={data.password || ""}
              autoComplete="new-password"
              placeholder="Required"
            />
          </FormGroup>

          <FormGroup required label="Password Confirmation" icon={EIcon.key}>
            <InputPassword
              disabled={loading}
              error={error?.password_confirmation}
              onChange={(e) => onChangeData({ ...data, password_confirmation: e.target.value })}
              value={data.password_confirmation || ""}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </FormGroup>

          <FormGroup label="Password Hint" icon={EIcon.lightbulb}>
            <Input
              disabled={loading}
              error={error?.password_hint}
              onChange={(e) => onChangeData({ ...data, password_hint: e.target.value })}
              value={data.password_hint || ""}
              placeholder="Hint (Recommended)"
            />
          </FormGroup>

          {error?.message && (
            <FormGroup>
              <ErrorMessage style={{ textAlign: "left", display: "flex", marginTop: 0 }}>
                {error?.message}
              </ErrorMessage>
            </FormGroup>
          )}

          <FormGroup addMarginBottom={false}>
            <Button disabled={loading} onClick={onSignUp} color="black">
              Sign up
            </Button>
          </FormGroup>
        </div>
      </>
    );
  };

  return (
    <Style.Container className="form">
      {signUpMode ? renderSignUp() : renderSignIn()}
    </Style.Container>
  );
}

export default Form;
