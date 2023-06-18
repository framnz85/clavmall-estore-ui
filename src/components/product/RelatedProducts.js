import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from '../cards/ProductCard';

import { getRelated } from "../../functions/product";

const RelatedProducts = ({ product, addCart = false }) => {
    let dispatch = useDispatch();
    const { slug } = product;

    const { products } = useSelector((state) => ({ ...state }));
    
  const [related, setRelated] = useState([]);

    useEffect(() => {
        loadRelatedProducts(product._id, product.category._id);
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadRelatedProducts = (prodId, catId) => {
        const relProducts = products.filter(
            (product) => product.category && product.category._id === catId && product.slug !== slug
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
        <div align="center" className="container" style={{ clear: "both", overflow: addCart ? "auto" : "unset" }}>
            {addCart ? <div align="left" style={{marginTop: 30}}>Related Products</div> : <>
                <hr />
                <h5>Related Products</h5>
                <hr />
            </>}

            <div style={{width: addCart ? 1200 : "100%"}}>
                {related.slice(0, addCart ? 6 : related.length).map((product) => {
                    return (
                        <ProductCard product={product} priceShow={true} key={product._id} addCart={addCart} />
                    );
                })}
            </div>
            <div style={{clear: "both"}}></div>
        </div>
     );
}
 
export default RelatedProducts;