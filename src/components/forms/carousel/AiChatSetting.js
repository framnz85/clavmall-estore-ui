import React from "react";
import { Link } from "react-router-dom";

import ShowingForms from "../../common/ShowingForms";

const AiChatSetting = ({ values, setValues }) => {
  const formProperty = [
    {
      name: "openaiAPI",
      label: "Openai API Key (Grocey)",
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
        <Link to="/admin/guide11">How To Setup Grocey?</Link>
      </div>
    </>
  );
};

export default AiChatSetting;
