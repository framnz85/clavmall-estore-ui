import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'
import { isMobile } from 'react-device-detect';
import { Badge,Button } from "antd";

import { CheckOutlined } from "@ant-design/icons";
import { RiHomeSmile2Line } from 'react-icons/ri'
import { AiOutlineShoppingCart } from 'react-icons/ai'

const CartButton = ({saveOrderToDb, cart, cartCalculation, minorder}) => {
    const history = useHistory();

    const [activeTabs, setActiveTabs] = useState("Francis");

    let { estore, inputs } = useSelector((state) => ({ ...state }));
    
    useEffect(() => {
        switch (activeTabs) {
            case 'home':
                history.push('/')
                break;
            case 'cart':
                history.push('/cart')
                break;
            default:
                break;
        }
    }, [activeTabs, history]);

    const tabStyle = {
        containier: {
            padding: 0,
            margin: 0,
            boxSizing: "border-box",
            position: "fixed",
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 1
        },
        bottomNav: {
            width: window.innerWidth,
            height: "56px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px solid rgb(230, 230, 230)"
        },
        bnTab: {
            width: "25%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        buyTab: {
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }
    }
        
    
    return (
        <div style={tabStyle.containier}>
            {isMobile && (
                <div style={tabStyle.bottomNav}>
                    <div style={tabStyle.bnTab}>
                        <RiHomeSmile2Line
                            size='35'
                            color={estore.headerColor}
                            onClick={() => setActiveTabs('home')}
                        />
                    </div>
                    <div style={tabStyle.buyTab}>
                        <Button
                            type="primary"
                            size="medium"
                            onClick={saveOrderToDb}
                            style={{ width: 190 }}
                            disabled={!cart.length || cartCalculation.subtotal < Number(minorder)}
                        >
                            <CheckOutlined /> Proceed to Checkout
                        </Button>
                    </div>
                    <div style={tabStyle.bnTab}>
                        <Badge count={inputs.cart && inputs.cart.map(p => parseInt(p.count)).reduce((a, b) => a + b, 0)} offset={[0, 0]}>
                            <AiOutlineShoppingCart
                                size='35'
                                color={estore.headerColor}
                                onClick={() => setActiveTabs('cart')}
                            />
                        </Badge>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default CartButton;