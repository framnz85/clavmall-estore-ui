import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from 'react-device-detect';

import ProductCard from '../cards/ProductCard';

import { getParent } from "../../functions/product";

const ParentProducts = ({ product }) => {
    let dispatch = useDispatch();
    const { slug } = product;

    const { products } = useSelector((state) => ({ ...state }));
    
    const [parent, setParent] = useState([]);

    useEffect(() => {
        loadParentProducts(product._id, product.parent._id);
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadParentProducts = (prodId, parId) => {
        const parProducts = products.filter(
            (product) => product.parent._id === parId && product.slug !== slug
        );
        if (parProducts.length < 60) {
            getParent(prodId).then((res) => {
                setParent(res.data);
                dispatch({
                    type: "PRODUCT_LIST_X",
                    payload: res.data,
                });
            });
        } else {
            setParent(parProducts);
        }
    };
    
    return ( 
        <div className="container bg-white mt-3 p-3">
            <div className="row">
                <div className="col text-center pt-3 pb-3" style={isMobile ? {margin: 0, padding: 0} : {}}>
                    <hr />
                    <h5>Other Variant</h5>
                    <hr />

                    <div className="row" style={{ marginLeft: "2px" }}>
                        {parent.map((product) => {
                        return (
                            <div
                                key={product._id}
                                className="col-m-2"
                                style={{ margin: "0 10px 10px 0" }}
                            >
                                <ProductCard product={product} priceShow={true} />
                            </div>
                        );
                        })}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default ParentProducts;