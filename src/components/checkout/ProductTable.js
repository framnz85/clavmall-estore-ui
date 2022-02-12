import React from "react";

const ProductTable = ({ products }) => {
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
                  {product.title} (
                  {product.variants.filter((v) => v._id === p.variant)[0].name})
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
                  = ₱{(product.price * p.count).toFixed(2)}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default ProductTable;
