import Input from "../../../Input/Input";
import RowManipulatorTable from "../../../RowManipulatorTable/RowManipulatorTable";

/**
 * Props.
 */
interface IHttpHeaders {
  value: any[];
  onChange: (data: any[]) => void;
}

/**
 */
function HttpHeaders(props: IHttpHeaders) {
  const { value, onChange } = props;

  const firstItem = value[0];
  if (firstItem?.name !== "TagoIO-Retries") {
    value.unshift({ name: "TagoIO-Retries", value: "<number of attempts>" });
  }
  if (value.length === 1) {
    value.push({ name: "", value: "" });
  }

  /**
   */
  const onChangeField = (field: keyof any, v: string, rowIndex: number) => {
    if (!value[rowIndex]) {
      value[rowIndex] = { name: "", value: "" }; // create the item if it doesn't exist
    }
    value[rowIndex][field] = v;
    onChange([...value]);
  };

  /**
   */
  const renderKey = (item: any, index: number) => {
    return (
      <Input
        value={item.name}
        onChange={(e) => onChangeField("name", e.target.value, index)}
        placeholder="content/type"
        disabled={index === 0}
      />
    );
  };

  /**
   */
  const renderValue = (item: any, index: number) => {
    return (
      <Input
        value={item.value}
        onChange={(e) => onChangeField("value", e.target.value, index)}
        placeholder="application/json"
        disabled={index === 0}
      />
    );
  };

  /**
   */
  const addItem = () => {
    props.value.push({ name: "", value: "" });
    onChange([...props.value]);
  };

  /**
   */
  const removeItem = (index: number) => {
    props.value.splice(index, 1);
    onChange([...props.value]);
  };

  return (
    <RowManipulatorTable<any>
      data={value}
      onAddItem={addItem}
      onRemoveItem={removeItem}
      columns={[
        {
          label: "Name",
          onRender: renderKey,
        },
        {
          label: "Value",
          onRender: renderValue,
        },
      ]}
    />
  );
}

export default HttpHeaders;
