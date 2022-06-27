import { getSystemName } from "@tago-io/tcore-shared";
import axios from "axios";
import { KeyboardEvent, useRef, useState, useCallback } from "react";
import { EButton, EIcon, FormGroup, Icon } from "../../..";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import InputPassword from "../../InputPassword/InputPassword";
import SetupForm from "../SetupForm/SetupForm";
import * as Style from "./StepMasterPassword.style";

/**
 */
function StepMasterPassword(props: any) {
  const { onBack, onNext } = props;
  const [value, setValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const confirmationRef = useRef<HTMLInputElement>(null);

  /**
   * Goes to the next step.
   */
  const next = useCallback(async () => {
    setErrorMsg("");

    if (value.length < 6) {
      setErrorMsg("Password must have at least 6 characters");
      return;
    }

    await axios.post("/settings/master/password", { password: value });
    onNext(value);
  }, [onNext, value]);

  /**
   * Called when the password input receives a keydown event.
   */
  const onPasswordKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirmationRef?.current?.focus();
    }
  }, []);

  /**
   * Called when the confirmation input receives a keydown event.
   */
  const onConfirmationKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        next();
      }
    },
    [next]
  );

  const nextDisabled = value !== confirmation || !value;

  return (
    <SetupForm
      title="Set a Master Password"
      description={`Add a layer of security to your ${getSystemName()}`}
      buttons={[
        { label: "Back", onClick: onBack },
        { label: "Next", onClick: next, disabled: nextDisabled, type: EButton.primary },
      ]}
    >
      <Style.Content>
        <Icon icon={EIcon.lock} size="50px" color="rgba(0, 0, 0, 0.2)" />

        <span className="info">
          To perform sensitive actions, such as resetting to factory settings or creating new
          accounts, you will need to provide the master password defined here.
        </span>

        <FormGroup label="Master Password" icon={EIcon.key}>
          <InputPassword
            autoComplete="new-password"
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onPasswordKeyDown}
            value={value}
            error={!!errorMsg}
          />
        </FormGroup>

        <FormGroup label="Master Password Confirmation" icon={EIcon.key}>
          <InputPassword
            autoComplete="new-password"
            inputRef={confirmationRef}
            onChange={(e) => setConfirmation(e.target.value)}
            onKeyDown={onConfirmationKeyDown}
            value={confirmation}
            error={!!errorMsg}
          />
        </FormGroup>

        {errorMsg && (
          <FormGroup>
            <ErrorMessage style={{ textAlign: "left", display: "flex", marginTop: 0 }}>
              {errorMsg}
            </ErrorMessage>
          </FormGroup>
        )}
      </Style.Content>
    </SetupForm>
  );
}

export default StepMasterPassword;
