import React, { useState } from "react";
import { Button } from "antd";

import { getMyPayment } from "../../../functions/payment";

const RemittanceDetails = ({payid}) => {
    const [showHowToPay, setShowHowToPay] = useState(false);
    const [bankName, setBankName] = useState("");
    const [payDetails, setPayDetails] = useState([]);

    const handleShowHowToPay = (payid) => {
        if (payDetails.length < 1) {
          getMyPayment(payid).then(res => {
              setBankName(res.data.name);
              setPayDetails(res.data.details);
            })
        }
        setShowHowToPay(!showHowToPay);
    }
    return ( 
        <>
            <Button
              className="btn btn-sm btn-block btn-outline-primary"
              onClick={() => handleShowHowToPay(payid)}
            >
              How To Pay?
            </Button>

            {showHowToPay &&
              <div>
                <div align="center" className="alert alert-success" role="alert">
                  <b>Here's how to Pay:</b><br/>
                  Go to the nearest {bankName} branch and send your payments to:<br /><br/>
                  {payDetails.map(det => (
                      <div align="center" key={det._id}>
                          <b>{det.desc}:</b> {det.value}
                      </div>
                  ))}
                  <br /><br/>
                  After sending the payment, send the details of your payment and the screenshot of your Remmitance Receipt to the email, messenger, or mobile number provided above.
                </div><br />
              </div>
            }
        </>
     );
}
 
export default RemittanceDetails;