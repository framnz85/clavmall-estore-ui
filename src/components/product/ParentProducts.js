import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
            (product) => product.parent && product.parent._id === parId && product.slug !== slug
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
        <div align="center" className="container" style={{clear: "both"}}>
            <hr />
            <h5>Other Variant</h5>
            <hr />

            <div>
                {parent.map((product) => {
                    return (
                        <ProductCard product={product} priceShow={true} key={product._id} />
                    );
                })}
            </div>
            <div style={{clear: "both"}}></div>
        </div>
     );
}
 
export default ParentProducts;