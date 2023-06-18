import React, { useState } from "react";
import { toast } from "react-toastify";
import InputFormList from "../../common/form/InputFormList";

const TextCarousel = ({ values, setValues }) => {
  const [showInput, setShowInput] = useState(true);

  const handleTextChange = (valuesData) => {
    setValues({
      ...values,
      textCarousel: valuesData.textCarousel,
    });
    toast.info(
      `Text carousel was updated however you need to click "Save Setting" to save.`
    );
  };

  return (
    <>
      <div className="p-3">
        <label>
          <b>Text Carousel</b>
        </label>
        <br />

        <InputFormList
          inputProperty={{
            type: "form list",
            name: "textCarousel",
            data: values,
            onChange: (e) => "",
            onFinish: handleTextChange,
            loading: false,
            input: [
              {
                inputName: "name",
                inputFieldKey: "name",
                inputMessage: "Missing text",
                placeholder: "Type text here...",
                showInput: true,
                width: "320px",
              },
            ],
            defaultList: [
              {
                name: "textCarousel",
                details: [{ name: "" }],
              },
            ],
            show: true,
            edit: false,
            showInput: showInput,
            setShowInput: setShowInput,
          }}
        />
      </div>
    </>
  );
};

export default TextCarousel;
