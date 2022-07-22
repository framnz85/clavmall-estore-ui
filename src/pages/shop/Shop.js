import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isMobile } from 'react-device-detect';

import ShopMenu from "../../components/shop/ShopMenu";
import ShopProduct from "../../components/shop/ShopProduct";

import { fetchProductByFilter } from "../../functions/product";

const initialState = {
  products: [],
  page: 1,
  showItemCount: 20,
  firstItemLoad: 60,
  nextItemLoad: 20,
  price: [],
  category: "",
  subcategory: "",
  parent: "",
  stars: 0,
};

const Shop = () => {
  let dispatch = useDispatch();

  const { inputs, products, user, estore } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const [search, setSearch] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  const {
    firstItemLoad,
    nextItemLoad,
    price,
    category,
    stars,
    subcategory,
    parent
  } = search;

  useEffect(() => {
    document.title = "Shop at " + estore.name;
    if (
      inputs.searchText.length < 1 &&
      price.length === 0 &&
      category === "" &&
      stars === 0 &&
      subcategory === "" &&
      parent === ""
    ) {
      loadRandomProducts(1, search);
    } else if (sessionStorage.getItem("searchShuffle") === '1') {
      loadRandomProducts(1, search);
    }
  }, [inputs.searchText, price, category, stars, subcategory, parent]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const loadRandomProducts = (nextPage, searchArg) => {
    let searchFilter = [...products];
    let isSearchingStar = false;

    const maxRandNum = nextPage === 1
      ? search.firstItemLoad
      : search.firstItemLoad + nextPage * search.nextItemLoad;
    
    searchFilter = shuffleProducts(searchFilter);

    if (inputs.searchText && inputs.searchText.length > 0) {
      searchFilter = searchFilter.filter((product) =>
        product.title.toLowerCase().includes(inputs.searchText.toLowerCase())
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

    setSearch({
      ...search,
      products: searchFilter,
      page: nextPage,
    })

    if (searchFilter.length < maxRandNum || isSearchingStar) {
      setLoading(true);
      setLoadMore(true);
      fetchProductByFilter(
        searchArg,
        nextPage === 1 ? firstItemLoad : nextItemLoad,
        user.address ? user.address : {}
      )
        .then((res) => {
          let result = [];
          const resultData=shuffleArray(res.data);
          resultData && resultData.map((data) => {
            const existProduct = products.filter(product => product._id === data._id);
            if (!existProduct.length) {
              result.push(data);
              searchFilter.push(data);
            };
            return {result, searchFilter};
          });
          setSearch({
            ...search,
            products: isSearchingStar ? res.data : searchFilter,
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-2 p-0 pr-2" style={{ marginTop: "1px" }}>
          <h4 style={{ margin: "20px 0" }}>Filter</h4>

          <ShopMenu
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="col-md-10" style={isMobile ? {margin: 0, padding: 0} : {}}>
          <h4 style={{ margin: "20px 0" }}>Products</h4>

          <ShopProduct
            search={search}
            loading={loading}
            loadMore={loadMore}
            loadRandomProducts={loadRandomProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;
