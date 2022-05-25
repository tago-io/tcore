import Input from "../Input/Input";
import RowManipulator from "../RowManipulator/RowManipulator";
import Select from "../Select/Select";
import * as Style from "./VariableCondition.style";

/**
 * Props.
 */
interface IVariableCondition {
  data: any;
  name?: string;
  useTextInput?: string;
  errors?: any;
  onChange: (data: any) => void;
}

/**
 */
function VariableCondition(props: IVariableCondition) {
  const { errors, data, onChange } = props;

  /**
   */
  const onChangeItem = (item: any, field: any, value: any) => {
    item[field] = value;
    onChange([...data]);
  };

  /**
   */
  const addItem = () => {
    data.push({});
    props.onChange([...data]);
  };

  /**
   */
  const removeItem = (index: number) => {
    data.splice(index, 1);
    props.onChange([...data]);
  };

  /**
   */
  const renderInput = (item: any, index: number) => {
    item.variable = item.variable || "";
    const error = errors?.[index];
    return (
      <Input
        value={item.variable}
        onChange={(e) => onChangeItem(item, "variable", e.target.value)}
        placeholder="type the variable here"
        error={error?.variable}
      />
    );
  };

  /**
   */
  const renderCondition = (item: any, index: number) => {
    item.is = item.is || "<";
    item.value = item.value || "";
    const error = errors?.[index];
    return (
      <>
        <Select
          value={item.is}
          onChange={(e) => onChangeItem(item, "is", e.target.value)}
          error={error?.is}
          options={[
            { label: "Less than", value: "<" },
            { label: "Greater than", value: ">" },
            { label: "Equal to", value: "=" },
            { label: "Different from", value: "!" },
            { label: "Anything", value: "*" },
          ]}
        />
        {item.is !== "*" && (
          <Input
            value={item.value || ""}
            onChange={(e) => onChangeItem(item, "value", e.target.value)}
            error={error?.value}
          />
        )}
      </>
    );
  };

  /**
   */
  const renderItem = (item: any, index: number) => {
    return (
      <>
        <span className="text">If</span>
        <div className="space" />
        <div className="input-container">{renderInput(item, index)}</div>
        <div className="space" />
        <span className="text">is</span>
        <div className="space" />
        <div className="condition-container">{renderCondition(item, index)}</div>
        <div className="space" />
      </>
    );
  };

  return (
    <Style.Container>
      <RowManipulator
        onAddItem={addItem}
        onRemoveItem={removeItem}
        data={data}
        onRenderItem={renderItem}
      />
    </Style.Container>
  );
}

export default VariableCondition;
