import React from "react";
import ShowingForms from "../../common/ShowingForms";

const AiChatSetting = ({ values, setValues }) => {
  const formProperty = [
    {
      name: "openaiAPI",
      label: "Openai API Key",
      onChange: (e) => setValues({ ...values, openaiAPI: e.target.value }),
      value: values.openaiAPI,
      show: true,
      edit: false,
    },
  ];

  return (
    <>
      <div className="pl-3">
        <ShowingForms formProperty={formProperty} />
      </div>
    </>
  );
};

export default AiChatSetting;
