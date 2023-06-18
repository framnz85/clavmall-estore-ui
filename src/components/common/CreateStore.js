import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import ForDomain from '../../images/fordomain.jpg'

const CreateStore = () => {
    const { estore } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (estore.allowAffiliateUser) {
            let x = 1;
            document.getElementById(`createStore${x}`).style.display = "block";
            x++;
            const createStoreInterval = setInterval(() => {
                if (document.getElementById(`createStore${x}`) != null) {
                    for (let i = 1; i <= 3; i++) {
                        document.getElementById(`createStore${i}`).style.display = "none";
                    }
                    document.getElementById(`createStore${x}`).style.display = "block";
                    x++;
                    if (x > 3) x = 1;
                } else {
                    clearInterval(createStoreInterval);
                }
            }, 10000);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const contentStyle = {
        height: '40px',
        lineHeight: '40px',
        textAlign: 'center',
        fontSize: 12,
        backgroundImage: `url(${ForDomain})`,
        color: "#666",
        cursor: "pointer",
        display: "none"
    };

    return (
        <div>
            <div>
                <h3 id={`createStore1`} style={contentStyle} onClick={() => window.open(`https://${estore.urlname1}.etnants.com/ogpa`, "_blank").focus()}>
                    You have also the power to start your own Online Store Business. Either online grocery or any ecommerce store. <u>LEARN MORE</u>
                </h3>
            </div>
            <div>
                <h3 id={`createStore2`} style={contentStyle} onClick={() => window.open(`https://${estore.urlname1}.etnants.com/ogpa`, "_blank").focus()}>
                    Online Grocery Business is now gaining popularity anywhere else. Start your own online grocery buisness too. <u>LEARN MORE</u>
                </h3>
            </div>
            <div>
                <h3 id={`createStore3`} style={contentStyle} onClick={() => window.open(`https://${estore.urlname1}.etnants.com/ogpa`, "_blank").focus()}>
                    Get the same website as this and start your own eCommerce Business. It could an Online Grocery or an online store selling your own products. <u>LEARN MORE</u>
                </h3>
            </div>
        </div>
    );
};
export default CreateStore;