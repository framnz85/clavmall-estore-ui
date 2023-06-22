import React, { useState } from "react";
import { Button } from "antd";

import ImageShow from "../../common/ImageShow";
import { getMyPayment } from "../../../functions/payment";

const BankTransferDetails = ({ payid }) => {
  const [showHowToPay, setShowHowToPay] = useState(false);
  const [images, setImages] = useState("");
  const [bankName, setBankName] = useState("");
  const [payDetails, setPayDetails] = useState([]);

  const handleShowHowToPay = (payid) => {
    if (payDetails.length < 1) {
      getMyPayment(payid).then((res) => {
        setImages(res.data.images);
        setBankName(res.data.name);
        setPayDetails(res.data.details);
      });
    }
    setShowHowToPay(!showHowToPay);
  };
  return (
    <>
      <Button
        className="btn btn-sm btn-block btn-outline-primary"
        onClick={() => handleShowHowToPay(payid)}
      >
        How To Pay?
      </Button>

      {showHowToPay && (
        <div>
          <div align="center" className="alert alert-success" role="alert">
            <b>Here's how to Pay:</b>
            <br />
            Send your payments by going to {bankName} and by using the details
            below: <br />
            <br />
            {payDetails.map((det) => (
              <div align="center" key={det._id}>
                <b>{det.desc}:</b> {det.value}
              </div>
            ))}
            {images && images[1] && (
              <>
                <br />
                <b>You may also scan the QR Code below</b>
                <br />
                <br />
                <ImageShow
                  alt="Bank Transfer"
                  imgid={images[1].url}
                  style={{ width: 150, height: 150 }}
                  type="/thumb"
                />
              </>
            )}
            <br />
            <br />
            After sending the payment, send the details of your payment and the
            screenshot of your Payment Receipt (ex. Deposit slip, etc.) to the
            email, messenger, or mobile number provided above.
          </div>
          <br />
        </div>
      )}
    </>
  );
};

export default BankTransferDetails;
