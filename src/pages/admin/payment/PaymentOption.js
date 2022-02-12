import React from "react";
import AdminNav from "../../../components/nav/AdminNav";

const PaymentOption = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Payment Option</h4>
        </div>
      </div>
    </div>
  );
};

export default PaymentOption;
