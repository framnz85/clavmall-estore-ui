import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AdminNav from "../../../components/nav/AdminNav";
import ProdShowCards from "../../../components/forms/product/ProdShowCards";
import ProdGroupSearch from "../../../components/forms/product/ProdGroupSearch";
import InputSearch from "../../../components/common/form/InputSearch";
import EstoreExpired from "../../../components/common/EstoreExpired";
import AddDomain from "../../../components/common/addDomain";

import { getProducts } from "../../../functions/product";

const initialState = {
  products: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "createdAt",
  sortkeys: [
    { id: "1", label: "Title (a-z)", value: "title", sort: 1 },
    { id: "2", label: "Title (z-a)", value: "title", sort: -1 },
    { id: "3", label: "Price (ascending)", value: "price", sort: 1 },
    { id: "4", label: "Price (descending)", value: "price", sort: -1 },
    { id: "5", label: "Date Uploaded (newest)", value: "createdAt", sort: 1 },
    { id: "6", label: "Date Uploaded (oldest)", value: "createdAt", sort: -1 },
    { id: "7", label: "Date Updated (latest)", value: "updatedAt", sort: 1 },
    { id: "8", label: "Date Updated (oldest)", value: "updatedAt", sort: -1 }
  ],
  sort: -1,
  category: "",
  subcat: "",
  parent: "",
  bulkAction: [
    { id: "1", label: "Multi-Supplier", value: "1" },
    { id: "5", label: "Multi-Markup", value: "5" },
    { id: "4", label: "Multi-Referral", value: "4" },
    { id: "3", label: "Multi-Status", value: "3" },
    { id: "2", label: "Multi-Delete", value: "2" },
  ],
};

const AllProducts = () => {
  let dispatch = useDispatch();

  const { admin } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadProducts();
  }, [values.currentPage, values.pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = () => {
    const {
      sortkey,
      sort,
      currentPage,
      pageSize,
      category,
      subcat,
      parent
    } = values;
    setLoading(true);
    getProducts(
      sortkey,
      sort,
      currentPage,
      pageSize,
      keyword,
      category,
      subcat,
      parent
    )
      .then((res) => {
        let result = [];
        res.data.products && res.data.products.map((data) => {
          const existProduct = admin.products.values.filter(product => product._id === data._id);
          if (!existProduct.length || res.data.query) {
            result.push({
              ...data, page: currentPage
            })
          }
          return result;
        });
        setValues({
          ...values,
          products: res.data.query ? result : [...admin.products.values, ...result],
          itemsCount: res.data.query ? parseInt(res.data.count)
            : admin.products.itemsCount > 0
              ? admin.products.itemsCount
              : parseInt(res.data.count),
        });
        !res.data.query && dispatch({
          type: "ADMIN_OBJECT_XVII",
          payload: {
            products: {
              ...admin.products,
              values: [...admin.products.values, ...result],
              pages: !admin.products.pages.includes(currentPage)
                ? [...admin.products.pages, currentPage]
                : admin.products.pages,
              itemsCount: admin.products.itemsCount > 0
                ? admin.products.itemsCount
                : parseInt(res.data.count),
            }
          }
        });
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const groupSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    loadProducts();
  };

  return (
    <div className="container">
      <div className="row pb-5">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <EstoreExpired />
          
          <h4 style={{ margin: "20px 0" }}>All Products</h4>

          <form onSubmit={groupSearchSubmit}>
            <InputSearch
              keyword={keyword}
              setKeyword={setKeyword}
              placeholder="Search product"
              data={values}
              setData={setValues}
            />
          </form>

          <ProdGroupSearch
            values={values}
            setValues={setValues}
            groupSearchSubmit={groupSearchSubmit}
          />
          <br /><br />

          <ProdShowCards
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
          />
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
