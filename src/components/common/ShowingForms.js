import React from "react";
import InputSelect from "./form/InputSelect";
import InputFormList from "./form/InputFormList";
import InputText from "./form/InputText";
import InputNumber from "./form/InputNumber";
import AntSelect from "./form/AntSelect";
import InputDatePicker from "./form/InputDatePicker";
import AntNumberRange from "./form/AntNumberRange";
import AntRangePicker from "./form/AntRangePicker";
import AntCheckbox from "./form/AntCheckbox";
import AntButton from "./form/AntButton";

const ShowingForms = ({ formProperty }) => {
  return (
    <>
      {formProperty.map((prop) =>
        prop.type === "select" ? (
          <div key={prop.name}>
            {prop.edit ? (
              <InputText inputProperty={prop} />
            ) : (
              <InputSelect inputProperty={prop} />
            )}
          </div>
        ) : prop.type === "form list" ? (
          <div key={prop.name}>
            {prop.show && <InputFormList inputProperty={prop} />}
          </div>
        ) : prop.type === "ant select" ? (
          <div key={prop.name}>
            {prop.show && <AntSelect inputProperty={prop} />}
          </div>
        ) : prop.type === "number" ? (
          <InputNumber key={prop.name} inputProperty={prop} />
        ) : prop.type === "numberrange" ? (
          <AntNumberRange key={prop.name} inputProperty={prop} />
        ) : prop.type === "datepicker" ? (
          <InputDatePicker key={prop.name} inputProperty={prop} />
        ) : prop.type === "ant datepicker" ? (
          <AntRangePicker key={prop.name} inputProperty={prop} />
        ) : prop.type === "ant checked" ? (
          <AntCheckbox key={prop.name} inputProperty={prop} />
        ) : prop.type === "button" ? (
          <AntButton key={prop.name} inputProperty={prop} />
        ) : (
          <InputText key={prop.name} inputProperty={prop} />
        )
      )}
    </>
  );
};

export default ShowingForms;
