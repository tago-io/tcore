import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { useHistory } from "react-router";
import setDocumentTitle from "../../Helpers/setDocumentTitle";
import { setLocalStorage } from "../../Helpers/localStorage";
import getAccountStatus from "../../Requests/getAccountStatus";
import getAccountByToken from "../../Requests/getAccountByToken";
import store from "../../System/Store";
import * as Style from "./Login.style";
import Background from "./Background/Background";
import Form from "./Form/Form";
import Welcome from "./Welcome/Welcome";

/**
 * Main login component (form + background).
 */
function Login() {
  const [data, setData] = useState<any>({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [readyToRender, setReadyToRender] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  const history = useHistory();

  /**
   * Validates credentials for signing in.
   * @returns {boolean} true for error.
   */
  const validateSignIn = useCallback(() => {
    const err: any = {};
    let hasError = false;

    if (!data.username) {
      err.username = true;
      hasError = true;
    }
    if (!data.password) {
      err.password = true;
      hasError = true;
    }

    setError(err);
    return hasError;
  }, [data]);

  /**
   * Signs in and sends the user to the /console root.
   */
  const signIn = useCallback(() => {
    if (validateSignIn()) {
      return;
    }

    setLoading(true);
    setError({});

    axios
      .post("/account/login", data)
      .then((r) => {
        setLocalStorage("token", r.data.result);
        store.token = r.data.result;

        getAccountByToken(r.data.result).then((account) => {
          setLoading(false);
          store.account = account;
          history.push("/console");
        });
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message || err?.toString?.();
        setError({ message: errorMessage, username: true, password: true });
        setLoading(false);
      });
  }, [history, data]);

  /**
   * Validates credentials for signing up.
   * @returns {boolean} true for error.
   */
  const validateSignUp = useCallback(() => {
    const err: any = {};
    let hasError = false;

    if (!data.username) {
      err.username = true;
      hasError = true;
    }
    if (!data.password) {
      err.password = true;
      err.password_confirmation = true;
      hasError = true;
    }
    if (!data.name) {
      err.name = true;
      hasError = true;
    }
    if (data.password !== data.password_confirmation) {
      err.password = true;
      err.password_confirmation = true;
      hasError = true;
    }

    setError(err);
    return hasError;
  }, [data]);

  /**
   * Routine to sign up and automatically login.
   */
  const signUp = useCallback(() => {
    if (validateSignUp()) {
      return;
    }

    setLoading(true);
    setError({});

    axios.post("/account", data).then(() => {
      signIn();
    });
  }, [validateSignUp, signIn, data]);

  /**
   */
  useEffect(() => {
    getAccountStatus()
      .then((result) => {
        setSignUpMode(result !== true);
        setReadyToRender(true);
      })
      .catch(() => {
        setSignUpMode(true);
        setReadyToRender(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sets the document title.
   */
  useEffect(() => {
    setDocumentTitle("Login");
  }, []);

  if (!readyToRender) {
    return null;
  }

  return (
    <Style.Container>
      <Background />
      <div className="front">
        <Welcome />
        <Form
          data={data}
          error={error}
          loading={loading}
          onChangeData={setData}
          onSignIn={signIn}
          onSignUp={signUp}
          signUpMode={signUpMode}
        />
      </div>
    </Style.Container>
  );
}

export default Login;
