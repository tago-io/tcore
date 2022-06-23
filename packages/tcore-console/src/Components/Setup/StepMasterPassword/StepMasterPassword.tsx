import axios from "axios";
import { KeyboardEvent, useRef, useState, useCallback } from "react";
import { EButton, EIcon, FormGroup } from "../../..";
import InputPassword from "../../InputPassword/InputPassword";
import SetupForm from "../SetupForm/SetupForm";
import * as Style from "./StepMasterPassword.style";

/**
 */
function StepMasterPassword(props: any) {
  const { onBack, onNext } = props;
  const [value, setValue] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const confirmationRef = useRef<HTMLInputElement>(null);

  /**
   */
  const next = useCallback(async () => {
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
      description="A Master Password allows you to perform sensitive actions in the system"
      buttons={[
        { label: "Back", onClick: onBack },
        { label: "Next", onClick: next, disabled: nextDisabled, type: EButton.primary },
      ]}
    >
      <Style.Content>
        <FormGroup label="Master Password" icon={EIcon.key}>
          <InputPassword
            autoComplete="new-password"
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onPasswordKeyDown}
            value={value}
          />
        </FormGroup>

        <FormGroup addMarginBottom={false} label="Master Password Confirmation" icon={EIcon.key}>
          <InputPassword
            autoComplete="new-password"
            inputRef={confirmationRef}
            onChange={(e) => setConfirmation(e.target.value)}
            onKeyDown={onConfirmationKeyDown}
            value={confirmation}
          />
        </FormGroup>
      </Style.Content>
    </SetupForm>
  );
}

export default StepMasterPassword;
