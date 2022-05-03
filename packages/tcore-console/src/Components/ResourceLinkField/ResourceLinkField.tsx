import { Link } from "react-router-dom";
import { Button, EButton, EIcon, Icon, Input, Tooltip } from "../..";
import * as Style from "./ResourceLinkField.style";

/**
 * Props.
 */
interface IResourceLinkFieldProps {
  name: string;
  icon: EIcon;
  type: string;
  link: string;
}

/**
 */
function ResourceLinkField(props: IResourceLinkFieldProps) {
  const { name, icon, type, link } = props;
  return (
    <Style.Container>
      <Input readOnly value={name} />

      <Tooltip text={`Open ${type} page in another tab`}>
        <Link target="_blank" to={link}>
          <Button type={EButton.icon}>
            <Icon icon={icon} size="15px" />
          </Button>
        </Link>
      </Tooltip>
    </Style.Container>
  );
}

export default ResourceLinkField;
