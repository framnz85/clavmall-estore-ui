import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Radio } from "antd";
import NumberFormat from "react-number-format";
import { isMobile } from "react-device-detect";

const ProductListItems = ({ product, setVariant }) => {
  const history = useHistory();
  const { slug, price, category, subcats, parent, variants, quantity, sold } =
    product;
  
  const { estore, products } = useSelector((state) => ({
      ...state,
  }));

  const showRelativeVariant = () => {
    let otherVariant = []
    const parProducts = products.filter(
      (product) => product.parent && product.parent._id === parent._id && product.slug !== slug
    );
    parProducts.map(product => {
      const parVariants = product && product.variants.map(variant => {
        return { ...variant, title: product.title, slug: product.slug }
      });
      return otherVariant = [...otherVariant, ...parVariants];
    });
    return otherVariant.map(othervar => 
      {
        let varName = "";
        if (othervar.name.length > 10) {
          const existChar = othervar.name.length - 10;
          othervar.name = othervar.name.slice(existChar);

          varName = othervar.title.length > 10
              ? othervar.title.slice(0, 5) + ": " + othervar.name
              : othervar.title + " " + othervar.name
        } else {
          varName = othervar.title.slice(0, 5) + ": " + othervar.name;
        }
        const randomNumber = Math.floor(Math.random() * 999999);
        return <Radio.Button
          value={othervar._id}
          key={othervar._id ? randomNumber + othervar._id : randomNumber}
          onClick={() => history.push(`/product/${othervar.slug}`)}
          style={{
            width: isMobile ? "92%" : "32%",
            textAlign: "center",
            borderRadius: 6,
            marginTop: 3,
            marginRight: 3,
            whiteSpace: "nowrap",
            minWidth: 150
          }}
        >
          {
            varName
          }
        </Radio.Button>
      }
    )
  }

  return (
    <ul className="list-group">
      <li className="list-group-item">
        <h4>Price</h4>
        <span
          className="label label-default label-pill pull-xs-right"
          style={{ color: "#ff8c00", fontSize: "22px" }}
        >
          <NumberFormat
            value={Number(price).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={estore.country.currency}
            style={{margin: 0}}
          />
        </span>
      </li>
      {category && (
        <li className="list-group-item">
          Category
          <Link
            to={`/category/${category.slug}`}
            className="label label-default label-pill pull-xs-right"
          >
            {category.name}
          </Link>
        </li>
      )}
      {subcats && (
        <li className="list-group-item">
          Sub Category
          {subcats.map((sub) => (
            <Link
              key={Math.floor(Math.random() * 999999) + (sub && sub._id)}
              to={`/subcats/${sub && sub.slug}`}
              className="label label-default label-pill pull-xs-right"
            >
              {sub && sub.name}
            </Link>
          ))}
        </li>
      )}
      {parent && (
        <li className="list-group-item">
          Parent / Brand
          <Link
            to={`/parent/${parent.slug}`}
            className="label label-default label-pill pull-xs-right"
          >
            {parent.name}
          </Link>
        </li>
      )}
      <li className="list-group-item">
        Available
        <span className="label label-default label-pill pull-xs-right">
          {quantity && quantity.toFixed(2)}
        </span>
      </li>
      <li className="list-group-item">
        Sold
        <span className="label label-default label-pill pull-xs-right">
          {sold && sold.toFixed(2)}
        </span>
      </li>
      {variants.length && (
        <>
          <li className="list-group-item">Variant:</li>
          <div style={{marginBottom: 20, marginLeft: 18}}>
            <Radio.Group defaultValue={""}>
              <Radio.Button
                style={{ display: "none" }}
                value="0"
              ></Radio.Button>
              {variants.map((v) => 
                {
                  if (v.name.length > 10) {
                    const existChar = v.name.length - 10;
                    v.name = v.name.slice(existChar);
                  }
                  const randomNumber = Math.floor(Math.random() * 999999);
                  return <Radio.Button
                    value={v._id}
                    key={v._id ? randomNumber + v._id : randomNumber}
                    onClick={(e) => setVariant(e.target.value)}
                    style={{
                      width: isMobile ? "92%" : "32%",
                      textAlign: "center",
                      borderRadius: 6,
                      marginTop: 3,
                      marginRight: 3,
                      whiteSpace: "nowrap",
                      minWidth: 150
                    }}
                  >
                    {
                      v.name
                    }
                  </Radio.Button>
                }
              )}
              {showRelativeVariant()}
            </Radio.Group>
          </div>
        </>
      )}
    </ul>
  );
};

export default ProductListItems;
