import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import ShowingForms from "../../common/ShowingForms";

const CategoryInputs = ({
  values,
  setValues,
  loading,
  edit,
}) => {

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const formProperty = [
    {
      type: "text",
      name: "name",
      label: "Category Name",
      onChange: handleChange,
      value: values.name,
      disabled: loading,
      show: true,
      edit,
    },
  ];

  return (
    <>
      {loading && (
        <h4 style={{ margin: "20px 0" }}>
          <LoadingOutlined />
        </h4>
      )}

      <ShowingForms formProperty={formProperty} />
    </>
  );
};

export default CategoryInputs;
