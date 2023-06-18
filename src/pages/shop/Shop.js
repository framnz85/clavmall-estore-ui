import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isMobile } from 'react-device-detect';
import { CaretRightOutlined, MenuOutlined } from "@ant-design/icons";

import ShopMenu from "../../components/shop/ShopMenu";
import ShopProduct from "../../components/shop/ShopProduct";

import { fetchProductByFilter } from "../../functions/product";
import getUnique from "../../components/common/getUnique";
import { getSubcat } from "../../functions/subcat";

const initialSearch = {
  text: "",
  price: [],
  category: [],
  subcategory: [],
  parent: [],
  stars: 0,
};

const initialState = {
  products: [],
  page: 1,
  showItemCount: 20,
  firstItemLoad: 60,
  nextItemLoad: 20,
};

const Shop = ({match}) => {
  let dispatch = useDispatch();
  const slug = match.params.slug;

  const { inputs, products, user, estore, categories, subcats, parents, } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const [search, setSearch] = useState(initialSearch);
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  
  const [categoryList, setCategoryList] = useState([...categories]);
  const [subcatList, setSubcatList] = useState([...subcats]);
  const [parentList, setParentList] = useState([...parents]);

  const [showNavigate, setShowNavigate] = useState(false);

  const {
    text,
    price,
    category,
    stars,
    subcategory,
    parent
  } = search;

  const {
    firstItemLoad,
    nextItemLoad,
  } = values;

  useEffect(() => {
    document.title = "Shop at " + estore.name;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    clearCategorySubcats();
    setSearch({...initialSearch, text: inputs.searchText});
    setValues({
      ...values,
      products: []
    });
    loadRandomProducts(1, true, inputs.searchText);
  }, [inputs.searchText]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    setValues({
      ...values,
      products: []
    });
    loadRandomProducts(1);
  }, [price, category, stars, subcategory, parent]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (slug) {
      const catFromSlug = categoryList.filter(cat => cat.slug === slug);
      const subFromSlug = subcatList.filter(sub => sub.slug === slug);
      clearCategorySubcats();
      
      let pathType = window.location.pathname;
      pathType = pathType.split("/");

      if (catFromSlug[0] && catFromSlug[0]._id) {
        if(pathType[1] && pathType[1] === "category") category.push(catFromSlug[0]._id);
      };
      if (subFromSlug[0] && subFromSlug[0]._id) {
        if(pathType[1] && pathType[1] === "subcats") subcategory.push(subFromSlug[0]._id)
      } else {
        if (pathType[1] && pathType[1] === "subcats") {
          getSubcat(slug).then(res => {
            if (res.data && res.data._id) {
              subcategory.push(res.data._id);
              setSubcatList([
                ...subcatList,
                res.data
              ])
              loadRandomProducts(1, true, "");
            }
          })
        }
      };

      setSearch({...search, text: ""});
      setValues({
        ...values,
        products: []
      });

      loadRandomProducts(1, true, "");
    }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearCategorySubcats = () => {
    while (category.length > 0) {
      category.pop();
    }
    while (subcategory.length > 0) {
      subcategory.pop();
    }
  }

  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  const shuffleProducts = (products) => {
    if (!sessionStorage.getItem("searchShuffle")) {
      products = shuffleArray(products);
      dispatch({
        type: "PRODUCT_LIST_XVIII",
        payload: products,
      });
      sessionStorage.setItem("searchShuffle", "1");
    }
    return products;
  }

  const loadRandomProducts = (nextPage, changeText = false, customText = "") => {
    let searchFilter = [...products];
    let isSearchingStar = false;
    const forSearchText = changeText ? customText ? customText : "" : text;

    const maxRandNum = nextPage === 1
      ? firstItemLoad
      : firstItemLoad + nextPage * nextItemLoad;
    
    searchFilter = shuffleProducts(searchFilter);

    if (forSearchText && forSearchText.length > 0) {
      searchFilter = searchFilter.filter((product) =>
        product.title.toLowerCase().includes(forSearchText.toLowerCase())
      );
    }
    if (price && price.length > 0) {
      searchFilter = searchFilter.filter(
        (product) => product.price >= price[0] && product.price <= price[1]
      );
    }
    if (category && category.length > 0) {
      searchFilter = searchFilter.filter((product) =>
        category.includes(product.category._id)
      );
    }
    if (subcategory && subcategory.length > 0) {
      searchFilter = searchFilter.filter((product) => {
        let isInclude = false;
        for (let i = 0; i < product.subcats.length; i++) {
          if (subcategory.includes(product.subcats[i]._id)) isInclude = true;
        }
        return isInclude;
      });
    }
    if (parent && parent.length > 0) {
      searchFilter = searchFilter.filter((product) =>
        parent.includes(product.parent._id)
      );
    }
    if (stars && stars > 0) {
      isSearchingStar = true;
    }

    setValues({
      ...values,
      products: searchFilter,
      page: nextPage,
    });
    
    const forSearch = changeText ? customText ? { ...search, text: customText } : { ...search, text: "" } : search;

    if (searchFilter.length < maxRandNum || isSearchingStar) {
      setLoading(true);
      setLoadMore(true);
      fetchProductByFilter(
        forSearch,
        nextPage === 1 ? firstItemLoad : nextItemLoad,
        user.address ? user.address : {}
      )
        .then((res) => {
          let result = [];
          const resultData=shuffleArray([...products, ...res.data]);
          resultData && resultData.map((data) => {
            const existProduct = products.filter(product => product._id === data._id);
            if (!existProduct.length) {
              result.push(data);
              searchFilter.push(data);
            };
            return {result, searchFilter};
          });
          const unique = getUnique(res.data, searchFilter);
          setValues({
            ...values,
            products: unique.all,
            page: nextPage,
          });
          dispatch({
            type: "PRODUCT_LIST_XVIII",
            payload: resultData,
          });
          setLoading(false);
          setLoadMore(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
          setLoadMore(false);
        });
    }
  };

  const showShopCat = () => {
    let catShop = "";
    if (category.length > 0) {
      catShop = categoryList.filter(cat => category.includes(cat._id));
    }
    if (catShop.length > 0) return <><CaretRightOutlined /> {catShop.map(cat => cat.name + ", ")}</>
  }

  const showShopSub = () => {
    let subShop = "";
    if (subcategory.length > 0) {
      subShop = subcatList.filter(sub => subcategory.includes(sub._id));
    }
    if (subShop.length > 0) return <><CaretRightOutlined /> {subShop.map(sub => sub.name + ", ")}</>
  }

  const showShopPar = () => {
    let parShop = "";
    if (parent.length > 0) {
      parShop = parentList.filter(par => parent.includes(par._id));
    }
    if (parShop.length > 0) return <><CaretRightOutlined /> {parShop.map(par => par.name + ", ")}</>
  }

  return (
    <>
      <div className="container">
        <div className="row">
          {!isMobile && <div className="col-md-2 p-0 pr-1" style={{ marginTop: "1px" }}>
            <h4 style={{ margin: "20px 0" }}>Filter</h4>

            <ShopMenu
              search={search}
              setSearch={setSearch}
              categoryList={categoryList}
              setCategoryList={setCategoryList}
              subcatList={subcatList}
              setSubcatList={setSubcatList}
              parentList={parentList}
              setParentList={setParentList}
            />
          </div>}
          <div className="col-md-10" style={isMobile ? {margin: 0, padding: 0} : {}}>
            <h4 style={{ margin: "18px", fontSize: isMobile ? 16 : "" }}>
              Products {showShopCat()} {showShopSub()} {showShopPar()}
            {isMobile && <div
                style={{ float: "right" }}
                onClick={() => setShowNavigate(showNavigate ? false : true)}
              >
                <MenuOutlined /> Filter
              </div>
              }
            </h4>

            {isMobile && showNavigate && <ShopMenu
              search={search}
              setSearch={setSearch}
              categoryList={categoryList}
              setCategoryList={setCategoryList}
              subcatList={subcatList}
              setSubcatList={setSubcatList}
              parentList={parentList}
              setParentList={setParentList}
            />}

            <ShopProduct
              values={values}
              loading={loading}
              loadMore={loadMore}
              loadRandomProducts={loadRandomProducts}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
