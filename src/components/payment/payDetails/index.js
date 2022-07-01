import React from 'react';

import BankTransferDetails from './BankTransferDetails';
import OnlineBankingDetails from './OnlineBankingDetails';
import RemittanceDetails from './RemittanceDetails';
import OnlinePaymentDetails from './OnlinePaymentDetails';
import CryptocurrencyDetails from './CryptocurrencyDetails';

const PaymentDetails = ({paymentOption, orderStatus}) => {
    return (
        <>
            {paymentOption.category === "Bank Transfer" &&
                (orderStatus === "Waiting Payment" || orderStatus === "Not Processed") &&
                <BankTransferDetails payid={paymentOption.payid} />
            }
            {paymentOption.category === "Online Banking" &&
                (orderStatus === "Waiting Payment" || orderStatus === "Not Processed") &&
                <OnlineBankingDetails payid={paymentOption.payid} />
            }
            {paymentOption.category === "Remittance" &&
                (orderStatus === "Waiting Payment" || orderStatus === "Not Processed") &&
                <RemittanceDetails payid={paymentOption.payid} />
            }
            {paymentOption.category === "Online Payment" &&
                (orderStatus === "Waiting Payment" || orderStatus === "Not Processed") &&
                <OnlinePaymentDetails payid={paymentOption.payid} />
            }
            {paymentOption.category === "Cryptocurrency" &&
                (orderStatus === "Waiting Payment" || orderStatus === "Not Processed") &&
                <CryptocurrencyDetails payid={paymentOption.payid} />
            }
        </>
    );
}
 
export default PaymentDetails;