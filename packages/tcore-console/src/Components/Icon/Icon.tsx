import { memo } from "react";
import { EIcon, icons } from "./Icon.types";
import * as Style from "./Icon.style";

/**
 * Props.
 */
interface IIcon {
  /**
   * Size of the icon.
   */
  size?: string;
  /**
   * The icon identifier.
   */
  icon?: EIcon;
  /**
   * Optional color of the icon.
   */
  color?: string;
  /**
   * If the icon should be rotating or not.
   */
  rotate?: boolean;
}

/**
 * Renders a dynamic SVG icon.
 */
function Icon(props: IIcon) {
  if (!props.icon) {
    return null;
  }

  const { rotate } = props;
  const Component = icons[props.icon];
  const size = props.size || "12px";

  return (
    <Style.Container isRotating={rotate} size={size} color={props.color}>
      {Component?.ReactComponent ? (
        // For CRA projects, the svg can be imported manually by using the `ReactComponent`
        // object inside of the imported .svg. This won't work for the tcore-console project.
        <Component.ReactComponent width={size} height={size} />
      ) : Component?.default ? (
        // The default import that is provided by the `@svg/core` library, this is the way that
        // tcore-console uses the svg element.
        <Component.default width={size} height={size} />
      ) : null}
    </Style.Container>
  );
}

export default memo(Icon);
