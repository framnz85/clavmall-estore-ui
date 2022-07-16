import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from 'react-device-detect';

import ProductCard from '../cards/ProductCard';

import { getRelated } from "../../functions/product";

const RelatedProducts = ({ product }) => {
    let dispatch = useDispatch();
    const { slug } = product;

    const { products } = useSelector((state) => ({ ...state }));
    
  const [related, setRelated] = useState([]);

    useEffect(() => {
        loadRelatedProducts(product._id, product.category._id);
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadRelatedProducts = (prodId, catId) => {
        const relProducts = products.filter(
            (product) => product.category._id === catId && product.slug !== slug
        );
        if (relProducts.length < 60) {
            getRelated(prodId).then((res) => {
                setRelated(res.data);
                dispatch({
                    type: "PRODUCT_LIST_XI",
                    payload: res.data,
                });
            });
        } else {
            setRelated(relProducts);
        }
    };
    
    return ( 
        <div className="container bg-white mt-3 p-3">
            <div className="row">
                <div className="col text-center pt-3 pb-3" style={isMobile ? {margin: 0, padding: 0} : {}}>
                    <hr />
                    <h5>Related Products</h5>
                    <hr />

                    <div className="row" style={{ marginLeft: "2px" }}>
                        {related.map((product) => {
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
 
export default RelatedProducts;