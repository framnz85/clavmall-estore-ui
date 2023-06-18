import React, { useState } from "react";
import { Button } from "antd";

import { getMyPayment } from "../../../functions/payment";

const CryptocurrencyDetails = ({payid}) => {
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
                  Go to your cryptocurrency wallet or exchnage (ex. Coins.ph, Binance, etc.) that is capable to transfer {bankName}. Send your payments using the details below: <br /><br />
                  {payDetails.map(det => (
                      <div align="center" key={det._id}>
                          <b>{det.desc}:</b> {det.value}
                      </div>
                  ))}
                  <br /><br/>
                  After sending the payment, send the details and the screenshot of your payment to the email, messenger, or mobile number provided above.
                </div><br />
              </div>
            }
        </>
     );
}
 
export default CryptocurrencyDetails;