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
  onChange: (data: any) => void;
}

/**
 */
function VariableCondition(props: IVariableCondition) {
  const { data, onChange } = props;

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
  const renderInput = (item: any) => {
    return (
      <Input
        value={item.variable}
        onChange={(e) => onChangeItem(item, "variable", e.target.value)}
        placeholder="type the variable here"
      />
    );
  };

  /**
   */
  const renderCondition = (item: any) => {
    return (
      <>
        <Select
          value={item.is}
          onChange={(e) => onChangeItem(item, "is", e.target.value)}
          options={[
            { label: "Less than", value: "<" },
            { label: "Greater than", value: ">" },
            { label: "Equal to", value: "=" },
            { label: "Different from", value: "<>" },
            { label: "Anything", value: "*" },
          ]}
        />
        {item.is !== "*" && (
          <Input value={item.value} onChange={(e) => onChangeItem(item, "value", e.target.value)} />
        )}
      </>
    );
  };

  /**
   */
  const renderItem = (item: any) => {
    return (
      <>
        <span className="text">If</span>
        <div className="space" />
        <div className="input-container">{renderInput(item)}</div>
        <div className="space" />
        <span className="text">is</span>
        <div className="space" />
        <div className="condition-container">{renderCondition(item)}</div>
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
