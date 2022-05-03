import { Tooltip } from "../..";
import Icon from "../Icon/Icon";
import { EIcon } from "../Icon/Icon.types";
import * as Style from "./Pagination.style";

/**
 * Props.
 */
interface IPaginationProps {
  /**
   * Current page.
   */
  page: number;
  /**
   * Amount of pages to be rendered.
   */
  pageAmount: number;
  /**
   * Called when the page was changed.
   */
  onChange: (page: number) => void;
  /**
   * Shows page number or not.
   */
  infinitePages?: boolean;
  /**
   * Total number of records in the list.
   * This is used only if the `infinitePages` prop is active.
   */
  amountOfRecords?: number;
  /**
   * Ideal amount of rows in the list.
   * This is used only if the `infinitePages` prop is active.
   */
  idealAmountOfRows?: number;
  /**
   */
  showConfigButton?: boolean;
  /**
   */
  onConfigButtonClick?: () => void;
  /**
   */
  showRefreshButton?: boolean;
  /**
   */
  onRefreshButtonClick?: () => void;
}

/**
 */
function Pagination(props: IPaginationProps) {
  const { page, pageAmount, amountOfRecords, idealAmountOfRows, infinitePages, onChange } = props;
  const array = new Array(pageAmount || 1).fill("").map((_, i) => i);

  /**
   * Goes back one page.
   */
  const goBack = () => {
    onChange(page - 1);
  };

  /**
   * Advances one page.
   */
  const goForward = () => {
    onChange(page + 1);
  };

  /**
   * Renders a single item.
   */
  const renderItem = (value: number) => {
    const selected = page === value;
    return (
      <Style.Button key={value} onClick={() => onChange(value)} selected={selected}>
        {value + 1}
      </Style.Button>
    );
  };

  /**
   */
  const renderArrow = (icon: EIcon, disabled: boolean, onClick: VoidFunction) => {
    return (
      <Style.Button disabled={disabled} onClick={onClick}>
        <Icon icon={icon} />
      </Style.Button>
    );
  };

  return (
    <Style.Container>
      {props.showConfigButton && (
        <Tooltip text="Configure table">
          <div className="config-button" onClick={props.onConfigButtonClick}>
            <Icon icon={EIcon.cog} size="13px" />
          </div>
        </Tooltip>
      )}

      {infinitePages ? (
        <>
          {renderArrow(EIcon["chevron-left"], page === 0, goBack)}
          {renderArrow(
            EIcon["chevron-right"],
            (amountOfRecords || 0) < (idealAmountOfRows || 0),
            goForward
          )}
        </>
      ) : pageAmount > 0 ? (
        <>
          {renderArrow(EIcon["chevron-left"], page === 0, goBack)}
          {array.map(renderItem)}
          {renderArrow(EIcon["chevron-right"], page === pageAmount - 1, goForward)}
        </>
      ) : null}

      {props.showRefreshButton && (
        <Tooltip text="Refresh variables">
          <div className="refresh-button" onClick={props.onRefreshButtonClick}>
            <Icon icon={EIcon.redo} size="13px" />
          </div>
        </Tooltip>
      )}
    </Style.Container>
  );
}

export default Pagination;
