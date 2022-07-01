import React from "react";
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";

const ProductTable = ({ products }) => {
  const { estore } = useSelector((state) => ({
      ...state,
  }));
  
  return (
    <table>
      <tbody>
        {products &&
          products.map((p, i) => {
            const product = p.product ? p.product : p;
            return (
              <tr key={i}>
                <td
                  className="col"
                  style={{ width: "500px", paddingBottom: "10px" }}
                >
                  {product.title}
                  ({product.variants.filter((v) => v._id === p.variant)[0].name})
                  @ <NumberFormat
                      value={Number(product.price).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={estore.country.currency}
                    />
                </td>
                <td
                  className="col"
                  style={{ width: "200px", paddingBottom: "10px" }}
                >
                  x {p.count}
                </td>
                <td
                  className="col"
                  style={{ width: "200px", paddingBottom: "10px" }}
                >
                  <NumberFormat
                    value={Number(product.price * p.count).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={estore.country.currency}
                />
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default ProductTable;
