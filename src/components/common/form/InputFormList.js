import React, { useEffect } from "react";
import { Form, Input, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const InputFormList = ({ inputProperty }) => {
  const {
    name,
    label,
    data,
    onChange,
    onFinish,
    loading,
    input,
    defaultList,
    showInput,
    setShowInput,
  } = inputProperty;
  const [form] = Form.useForm();

  useEffect(() => {
    const checkData = defaultList.filter(
      (forForm) => forForm.name === data.name
    );
    if (checkData[0]) {
      form.setFieldsValue({ [name]: checkData[0].details });
      setShowInput(false);
    } else {
      if (data[name]) {
        form.setFieldsValue({ [name]: data[name] });
      } else {
        form.setFieldsValue({ [name]: defaultList[0].details });
      }
      setShowInput(true);
    }
  }, [form, data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="form-group">
      {label && (
        <label>
          <b>{label}</b>
        </label>
      )}

      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name={name}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  {input &&
                    input.map((inp) => (
                      <Form.Item
                        {...restField}
                        key={inp.inputName}
                        name={[name, inp.inputName]}
                        fieldKey={[fieldKey, inp.inputFieldKey]}
                        rules={[{ required: true, message: inp.inputMessage }]}
                      >
                        <Input
                          placeholder={inp.placeholder}
                          onChange={onChange}
                          style={
                            !inp.showInput
                              ? {
                                color: "black",
                                background: "white",
                                width: inp.width && inp.width
                              }
                              : { width: inp.width && inp.width }
                          }
                          disabled={!inp.showInput || loading}
                          bordered={inp.showInput}
                        />
                      </Form.Item>
                    ))}
                  {showInput && <MinusCircleOutlined
                    onClick={() => {
                      remove(name);
                    }}
                  />}
                </Space>
              ))}
              {showInput && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InputFormList;
