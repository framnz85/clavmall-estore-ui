import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Tooltip, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import SingleProduct from "../../components/product/SingleProduct";
import ParentProducts from "../../components/product/ParentProducts";
import RelatedProducts from "../../components/product/RelatedProducts";
import Footer from "../../components/home/Footer";
import CategoryProducts from "../../components/home/CategoryProducts";
import SubcatList from "../../components/home/SubcatList";
import ParentList from "../../components/home/ParentList";

import { getProduct, productStar } from "../../functions/product";
import filterProductsAddress from "../../components/common/filterProductsAddress";

const initialState = {
  _id: "",
  title: "",
  description: "",
  supplierPrice: "",
  markup: "",
  price: "",
  category: "",
  subcats: [],
  parent: "",
  quantity: "",
  variants: [],
  images: [],
  ratings: [],
};

const Product = ({ match }) => {
  let dispatch = useDispatch();

  const { user, products, estore } = useSelector((state) => ({ ...state }));

  const [product, setProduct] = useState(initialState);
  const [unavailable, setUnavailable] = useState(false);
  const [star, setStar] = useState(0);
  const [tabMenu, setTabMenu] = useState(1);
  const [copied, setCopied] = useState("Copy to Clipboard");

  const slug = match.params.slug;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSingleProduct();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSingleProduct = () => {
    const thisProduct = products.filter((product) => product.slug === slug);
    if (thisProduct[0]) {
      document.title = thisProduct[0].title;
      setProduct({ ...initialState, ...thisProduct[0] });
      loadRatingDefault(thisProduct[0]);
      if (!filterProductsAddress(thisProduct, user.address).length) {
        setUnavailable(true);
      }
    } else {
      getProduct(slug).then((res) => {
        document.title = res.data.title;
        setProduct({ ...initialState, ...res.data });
        loadRatingDefault(res.data);
        if (!filterProductsAddress([res.data], user.address).length) {
          setUnavailable(true);
        } else {
          products.push(res.data);
        }
      });
    }
  };

  const loadRatingDefault = (thisProduct) => {
    if (thisProduct.ratings && user) {
      let existingRatingObject = thisProduct.ratings.find(
        (ele) => ele.postedBy === user._id
      );
      setStar(existingRatingObject ? existingRatingObject.star : 0);
    }
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token).then((res) => {
      const newProducts = products.map((product) =>
        product._id === res.data[0]._id ? res.data[0] : product
      );
      setProduct(res.data[0]);
      dispatch({
        type: "PRODUCT_LIST_XVII",
        payload: newProducts,
      });
    });
  };

  const copyClipboard = (num) => {
    const copyText = document.getElementById("myInput" + num);
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
    setCopied("Copied")
  }

  const tabs = {
    float: "left",
    padding: "5px 10px",
    borderTop: "1px solid #aaa",
    borderLeft: "1px solid #aaa",
    width: 140,
    textAlign: "center",
    cursor: "pointer",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4
  }

  return (
    <>
      <div className="container bg-white mt-3 p-4">
        <div className="row pt-4">
          <SingleProduct
            product={product}
            onStarClick={onStarClick}
            star={star}
            unavailable={unavailable}
          />
        </div>
      </div>

      <div className="container bg-white mt-3 p-4">
        <div style={{borderBottom: "1px solid #aaa"}}>
          <div style={{...tabs, backgroundColor: tabMenu === 1 ? "#fff" : "#eee"}} onClick={() => setTabMenu(1)}>More Details</div>
          <div style={{...tabs, borderRight: "1px solid #aaa", backgroundColor: tabMenu === 2 ? "#fff" : "#eee"}} onClick={() => setTabMenu(2)}>Earn Commission</div>
          <div style={{clear: "both"}}></div>
        </div>
        <br />
        
        {tabMenu === 1 && <div>
          <b>Description</b><br /><br />
          {product.description && product.description}
        </div>}
        
        {tabMenu === 2 && <div>
          <b>Referral Link For This Product</b><br /><br />
          {user._id && product.referral ? <Input.Group compact>
            Invite other people you know to buy this product and earn awesome commission. Just give them the link below.<br />
            <Input
              style={{ width: "90%" }}
              defaultValue={`${window.location.href}/?refid=${user._id}`}
              id="myInput1"
              readOnly
            />
            <Tooltip title={copied}>
              <Button icon={<CopyOutlined />} onClick={() => copyClipboard(1)} />
            </Tooltip>
          </Input.Group> : user._id && <div>Sorry, there is no referral commission you get from this product</div>}
        </div>}
        {!user._id && <div>Login to get awesome commissions when you refer this product to other people.</div>}
      </div>
      
      {product && product.slug && (
        <>
          <ParentProducts product={product} />
          <RelatedProducts product={product} />
        </>
      )}
      {estore.showCategories && (
        <div style={{clear: "both"}}>
          <div className="container">
            <CategoryProducts />
          </div>
          <div className="bg-white mt-3 p-3">
            <SubcatList />
            <ParentList />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Product;
