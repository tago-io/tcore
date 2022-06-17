import { useCallback } from "react";
import { useHistory } from "react-router";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import { EIcon } from "../Icon/Icon.types";
import Logo from "../../../assets/images/logo-black.svg";
import { EButton } from "../Button/Button.types";
import Link from "../Link/Link";
import { setLocalStorage } from "../../Helpers/localStorage";
import store from "../../System/Store";
import * as Style from "./Navbar.style";

/**
 * Props.
 */
interface INavbarProps {
  /**
   * This function will be called when the user presses the sidebar button. It should
   * toggle the current state of the sidebar.
   */
  onSidebarToggle?: () => void;
  /**
   * Anything that can go on the right side of the logo.
   */
  versionName?: string;
  /**
   * Ideal logo width. The height will be based around this width.
   */
  logoWidth?: number;
}

/**
 * This is the main navigation bar located at the top of the page.
 */
function Navbar(props: INavbarProps) {
  // const theme = useTheme();
  // const updateTheme = useContext(ThemeUpdateContext);
  const { logoWidth, onSidebarToggle } = props;
  const history = useHistory();

  /**
   * Removes the account, token, and goes back to the /console/login route.
   */
  const signOut = useCallback(() => {
    store.account = undefined;
    store.token = "";
    setLocalStorage("token", "");
    history.push("/console/login");
  }, [history]);

  return (
    <Style.Container logoWidth={logoWidth || 120} data-testid="navbar">
      <Button
        className="sidebar-button"
        onClick={onSidebarToggle}
        type={EButton.primary}
        testId="sidebar-button"
      >
        <Icon size="17px" icon={EIcon.bars} />
      </Button>

      <div className="logo-container">
        <Logo data-testid="logo" />
        {props.versionName ? (
          <>
            <div className="pipe" />
            <span className="alpha">Beta</span>
          </>
        ) : null}
      </div>

      <Style.RightSection>
        <Link href="/console/logs">
          <Button type={EButton.primary} testId="plugin-logs-button">
            <Icon size="17px" icon={EIcon.scroll} />
          </Button>
        </Link>

        <Button onClick={signOut} type={EButton.primary}>
          <Icon size="17px" icon={EIcon["sign-out-alt"]} />
        </Button>
      </Style.RightSection>
    </Style.Container>
  );
}

export default Navbar;
