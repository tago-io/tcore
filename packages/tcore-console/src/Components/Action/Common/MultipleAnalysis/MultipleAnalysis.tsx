import { IAnalysis } from "@tago-io/tcore-sdk/types";
import AnalysisPicker from "../../../Analysis/Common/AnalysisPicker/AnalysisPicker";
import RowManipulator from "../../../RowManipulator/RowManipulator";

/**
 * Props.
 */
interface IMultipleAnalysis {
  data: (IAnalysis | null)[];
  onChange: (data: (IAnalysis | null)[]) => void;
  /**
   * Error of the fields.
   */
  errors?: boolean[];
  /**
   * Position of the options container. Default is `bottom`.
   */
  optionsPosition?: "top" | "bottom";
}

/**
 */
function MultipleAnalysis(props: IMultipleAnalysis) {
  const { data, errors, optionsPosition, onChange } = props;

  /**
   */
  const addItem = () => {
    data.push(null);
    onChange([...data]);
  };

  /**
   */
  const removeItem = (index: number) => {
    data.splice(index, 1);
    onChange([...data]);
  };

  /**
   */
  const renderItem = (item: any, index: number) => {
    return (
      <div style={{ flex: "1", marginRight: "10px" }}>
        <AnalysisPicker
          value={item}
          error={errors?.[index]}
          optionsPosition={optionsPosition}
          onChange={(e: IAnalysis) => {
            data[index] = e;
            onChange([...data]);
          }}
        />
      </div>
    );
  };

  return (
    <RowManipulator
      data={data}
      onAddItem={addItem}
      onRemoveItem={removeItem}
      onRenderItem={renderItem}
    />
  );
}

export default MultipleAnalysis;
