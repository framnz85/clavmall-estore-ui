import React from "react";
import { Button } from "antd";

const CategoryForm = ({
  handleSubmit,
  name,
  setName,
  loading,
  placeholder,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          placeholder={placeholder}
          autoFocus
          required
          disabled={loading}
        />

        <Button
          onClick={handleSubmit}
          type="primary"
          className="mb-3"
          block
          shape="round"
          size="large"
          disabled={name.length < 2 || loading}
          style={{ marginTop: "30px", width: "150px" }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
