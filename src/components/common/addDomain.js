import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import ForDomain from '../../images/fordomain.jpg'

const AddDomain = () => {
    const { estore } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (estore.planType === "plan-1") {
            let x = 1;
            document.getElementById(`addDomain${x}`).style.display = "block";
            x++;
            const addDomainInterval = setInterval(() => {
                if (document.getElementById(`addDomain${x}`) != null) {
                    for (let i = 1; i <= 4; i++) {
                        document.getElementById(`addDomain${i}`).style.display = "none";
                    }
                    document.getElementById(`addDomain${x}`).style.display = "block";
                    x++;
                    if (x > 4) x = 1;
                } else {
                    clearInterval(addDomainInterval);
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

    const domainStyle = {
        color: estore.headerColor
    }

    return (
        <div>
            <div>
                <h3 id={`addDomain1`} style={contentStyle} onClick={() => window.open(`https://ogpa.clavstore.com/article/url-name-upgrade/?url=${estore.urlname1}`, "_blank").focus()}>
                    Upgrading your <b style={domainStyle}>{estore.urlname1}.clavstore.com</b> into <b style={domainStyle}>{estore.urlname1}.com</b> will make your website safer. <u>LEARN MORE</u>
                </h3>
            </div>
            <div>
                <h3 id={`addDomain2`} style={contentStyle} onClick={() => window.open(`https://ogpa.clavstore.com/article/mobile-app-purchase/?url=${estore.urlname1}`, "_blank").focus()}>
                    By adding a <b>Mobile App</b> to your website, you have given your customer ease to remember you thus making them buy in you regularly. <u>LEARN MORE</u>
                </h3>
            </div>
            <div>
                <h3 id={`addDomain3`} style={contentStyle} onClick={() => window.open(`https://ogpa.clavstore.com/article/url-name-upgrade/?url=${estore.urlname1}`, "_blank").focus()}>
                    Pay your next 12 months Subscription Fee, we'll turn <b style={domainStyle}>{estore.urlname1}.clavstore.com</b> into <b style={domainStyle}>{estore.urlname1}.com</b> or to the domain you want. <u>LEARN MORE</u>
                </h3>
            </div>
            <div>
                <h3 id={`addDomain4`} style={contentStyle} onClick={() => window.open(`https://ogpa.clavstore.com/article/mobile-app-purchase/?url=${estore.urlname1}`, "_blank").focus()}>
                    A <b>Mobile App</b> can provide a seamless and user-friendly experience for customers, with easy navigation and fast loading times. <u>LEARN MORE</u>
                </h3>
            </div>
        </div>
    );
};
export default AddDomain;