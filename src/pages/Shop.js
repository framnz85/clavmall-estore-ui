import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Menu, Input, Checkbox, Button } from "antd";
import { toast } from "react-toastify";
import {
  LoadingOutlined,
  DollarOutlined,
  CaretRightOutlined,
  DownSquareOutlined,
  StarOutlined,
  TagsOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { fetchProductByFilter, getRandomProducts } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";
import { getCategories } from "./../functions/category";
import Star from "../components/forms/Star";
import { getSubcats } from "./../functions/subcat";
import { getParents } from "./../functions/parent";

const { SubMenu, Item } = Menu;

const Shop = () => {
  const dispatch = useDispatch();

  const { search, categories, subcats, parents, products } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const [searchProducts, setSearchProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [categoryList, setCategoryList] = useState([...categories]);
  const [maxCategories, setMaxCategories] = useState(7);
  const [subcatList, setSubcatlist] = useState([...subcats]);
  const [maxSubcats, setMaxSubcats] = useState(7);
  const [parentList, setParentList] = useState([...parents]);
  const [maxParents, setMaxParents] = useState(7);

  const { text, price, category, stars, subcategory, parent } = search;

  const [minPrice, setMinPrice] = useState(price && price[0]);
  const [maxPrice, setMaxPrice] = useState(price && price[1]);
  const [categoryIds, setCategoryIds] = useState(category ? category : []);
  const [subcatIds, setSubcatIds] = useState(subcategory ? subcategory : []);
  const [parentIds, setParentIds] = useState(parent ? parent : []);

  useEffect(() => {
    if (
      text.length < 1 &&
      price === undefined &&
      category === undefined &&
      stars === undefined &&
      subcategory === undefined &&
      parent === undefined
    ) {
      loadRandomProducts(1);
    }
    shuffleArray([...products]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    setSearchProducts(array);
  };

  const loadRandomProducts = (nextPage) => {
    setPage(nextPage);
    const maxRandNum = nextPage === 1 ? 60 : 60 + nextPage * 20;
    if (products.length < maxRandNum) {
      setLoading(true);
      setLoadMore(true);
      nextPage === 1 ? setLoading(true) : setLoadMore(true);
      getRandomProducts(nextPage === 1 ? 60 : 20)
        .then((res) => {
          let unique = _.uniqWith([...products, ...res.data], _.isEqual);
          setSearchProducts(unique);
          dispatch({
            type: "PRODUCT_LIST",
            payload: unique,
          });
          localStorage.setItem("products", JSON.stringify(unique));
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

  useEffect(() => {
    fetchProducts(search, 1);

    loadCategories();
    loadSubcats();
    loadParents();
  }, [text, price, category, stars, subcategory, parent]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("categories")) {
        getCategories().then((category) => {
          setCategoryList(category.data.categories);
          dispatch({
            type: "CATEGORY_LIST",
            payload: category.data.categories,
          });
          localStorage.setItem(
            "categories",
            JSON.stringify(category.data.categories)
          );

          let unique = _.uniqWith(
            [...products, ...category.data.products],
            _.isEqual
          );
          dispatch({
            type: "PRODUCT_LIST",
            payload: unique,
          });
          localStorage.setItem("products", JSON.stringify(unique));
        });
      }
    }
  };

  const loadSubcats = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("subcats")) {
        getSubcats().then((subcat) => {
          setSubcatlist(subcat.data);
          dispatch({
            type: "SUBCAT_LIST",
            payload: subcat.data,
          });
          localStorage.setItem("subcats", JSON.stringify(subcat.data));
        });
      }
    }
  };

  const loadParents = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("parents")) {
        getParents().then((parent) => {
          setParentList(parent.data);
          dispatch({
            type: "PARENT_LIST",
            payload: parent.data,
          });
          localStorage.setItem("parents", JSON.stringify(parent.data));
        });
      }
    }
  };

  const fetchProducts = (searchArg, nextPage) => {
    let isSearching = false;
    let isSearchingStar = false;
    let searchFilter = [...products];

    if (text && text.length > 0) {
      isSearching = true;
      searchFilter = searchFilter.filter((product) =>
        product.title.toLowerCase().includes(text.toLowerCase())
      );
    }
    if (price && price.length > 0) {
      isSearching = true;
      searchFilter = searchFilter.filter(
        (product) => product.price >= price[0] && product.price <= price[1]
      );
    }
    if (category && category.length > 0) {
      isSearching = true;
      searchFilter = searchFilter.filter((product) =>
        category.includes(product.category._id)
      );
    }
    if (subcategory && subcategory.length > 0) {
      isSearching = true;
      searchFilter = searchFilter.filter((product) => {
        let isInclude = false;
        for (let i = 0; i < product.subcats.length; i++) {
          if (subcategory.includes(product.subcats[i]._id)) isInclude = true;
        }
        return isInclude;
      });
    }
    if (parent && parent.length > 0) {
      isSearching = true;
      searchFilter = searchFilter.filter((product) =>
        parent.includes(product.parent._id)
      );
    }
    if (stars && stars > 0) {
      isSearching = true;
      isSearchingStar = true;
    }

    setSearchProducts(searchFilter);

    if (isSearching) {
      const maxRandNum = nextPage === 1 ? 60 : 60 + nextPage * 20;
      if (searchFilter.length < maxRandNum || isSearchingStar) {
        setLoadMore(true);
        fetchProductByFilter(searchArg, nextPage === 1 ? 60 : 20)
          .then((res) => {
            let unique = _.uniqWith([...products, ...res.data], _.isEqual);
            setSearchProducts(
              _.uniqWith(
                isSearchingStar ? res.data : [...searchFilter, ...res.data],
                _.isEqual
              )
            );
            dispatch({
              type: "PRODUCT_LIST",
              payload: unique,
            });
            localStorage.setItem("products", JSON.stringify(unique));
            setLoadMore(false);
          })
          .catch((error) => {
            toast.error(error.message);
            setLoadMore(false);
          });
      }
    } else {
      loadRandomProducts(nextPage);
    }
  };

  const handlePrice = () => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: {
        price: [
          minPrice ? parseFloat(minPrice) : 0,
          maxPrice ? parseFloat(maxPrice) : 999999999,
        ],
      },
    });
  };

  const showCategories = (maxShow) =>
    categoryList
      .slice(0, maxShow ? maxShow : categoryList.length)
      .map((cat) => (
        <Checkbox
          onChange={handleCategoryCheck}
          key={cat._id}
          className="m-0 p-0 mb-1"
          value={cat._id}
          name="category"
          checked={categoryIds.includes(cat._id)}
        >
          {cat.name.length > 14
            ? cat.name.slice(0, 14) + "..."
            : cat.name + Array(10).fill("\xa0").join("")}
        </Checkbox>
      ));

  const handleCategoryCheck = (e) => {
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }

    setCategoryIds(inTheState);

    dispatch({
      type: "SEARCH_QUERY",
      payload: {
        category: inTheState ? inTheState : [],
      },
    });
  };

  const handleStarClick = (num) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: {
        stars: num,
      },
    });
  };

  const showSubcats = (maxShow) =>
    subcatList.slice(0, maxShow ? maxShow : subcatList.length).map((sub) => (
      <Checkbox
        onChange={handleSubcatCheck}
        key={sub._id}
        className="m-0 p-0 mb-1"
        value={sub._id}
        name="subcategory"
        checked={subcatIds.includes(sub._id)}
      >
        {sub.name.length > 14
          ? sub.name.slice(0, 14) + "..."
          : sub.name + Array(10).fill("\xa0").join("")}
      </Checkbox>
    ));

  const handleSubcatCheck = (e) => {
    let inTheState = [...subcatIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }

    setSubcatIds(inTheState);

    dispatch({
      type: "SEARCH_QUERY",
      payload: {
        subcategory: inTheState ? inTheState : [],
      },
    });
  };

  const showParents = (maxShow) =>
    parentList.slice(0, maxShow ? maxShow : parentList.length).map((par) => (
      <Checkbox
        onChange={handleParentCheck}
        key={par._id}
        className="m-0 p-0 mb-1"
        value={par._id}
        name="parent"
        checked={parentIds.includes(par._id)}
      >
        {par.name.length > 14
          ? par.name.slice(0, 14) + "..."
          : par.name + Array(10).fill("\xa0").join("")}
      </Checkbox>
    ));

  const handleParentCheck = (e) => {
    let inTheState = [...parentIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }

    setParentIds(inTheState);

    dispatch({
      type: "SEARCH_QUERY",
      payload: {
        parent: inTheState ? inTheState : [],
      },
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-2 p-0 pr-2" style={{ marginTop: "1px" }}>
          <h4 style={{ margin: "20px 0" }}>Filter</h4>

          <Menu
            defaultOpenKeys={["1", "2", "3", "4", "5"]}
            mode="inline"
            className="bg-white"
          >
            <SubMenu
              key="1"
              title={
                <span>
                  <DollarOutlined /> Price
                </span>
              }
            >
              <Item key="priceItem" className="align-top m-0 p-0 pl-1 bg-white">
                <Input
                  placeholder="min"
                  size="small"
                  style={{ fontSize: "14px", width: "70px", float: "left" }}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <div
                  style={{
                    float: "left",
                    borderBottom: "1px solid #666666",
                    height: "10px",
                    width: "5px",
                    margin: "3px",
                    color: "#ffffff",
                  }}
                >
                  a
                </div>
                <Input
                  placeholder="max"
                  size="small"
                  style={{ fontSize: "14px", width: "70px", float: "left" }}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <CaretRightOutlined
                  style={{ cursor: "pointer", fontSize: "26px", float: "left" }}
                  onClick={handlePrice}
                />
              </Item>
            </SubMenu>
            <SubMenu
              key="2"
              title={
                <span>
                  <DownSquareOutlined /> Categories
                </span>
              }
              className="p-1"
            >
              {showCategories(maxCategories)}
              {maxCategories && (
                <Item
                  key="viewCategory"
                  onClick={() => setMaxCategories(undefined)}
                >
                  View More
                </Item>
              )}
            </SubMenu>
            <SubMenu
              key="3"
              title={
                <span>
                  <StarOutlined /> Ratings
                </span>
              }
              className="p-1"
            >
              <Star starClick={handleStarClick} numberOfStars={5} />
              <Star starClick={handleStarClick} numberOfStars={4} />
              <Star starClick={handleStarClick} numberOfStars={3} />
              <Star starClick={handleStarClick} numberOfStars={2} />
              <Star starClick={handleStarClick} numberOfStars={1} />
              <Item key="resetStar" onClick={() => handleStarClick(0)}>
                All Ratings
              </Item>
            </SubMenu>
            <SubMenu
              key="4"
              title={
                <span>
                  <TagsOutlined /> Sub Categories
                </span>
              }
              className="p-1"
            >
              {showSubcats(maxSubcats)}
              {maxSubcats && (
                <Item
                  key="viewSubcats"
                  onClick={() => setMaxSubcats(undefined)}
                >
                  View More
                </Item>
              )}
            </SubMenu>
            <SubMenu
              key="5"
              title={
                <span>
                  <WindowsOutlined /> Parents / Brands
                </span>
              }
              className="p-1"
            >
              {showParents(maxParents)}
              {maxParents && (
                <Item
                  key="viewParents"
                  onClick={() => setMaxParents(undefined)}
                >
                  View More
                </Item>
              )}
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-10">
          <h4 style={{ margin: "20px 0" }}>
            {loading ? <LoadingOutlined /> : "Products"}
          </h4>

          {searchProducts.length < 1 && (
            <>
              <p className="text-danger">No products found for this search</p>
              <h4 style={{ margin: "50px 0 20px 0" }}>
                {loading ? <LoadingOutlined /> : "Items you may also like"}
              </h4>
              <div className="row">
                {products.length > 0 &&
                  products.slice(0, 20).map((product) => {
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
            </>
          )}

          <div className="row">
            {searchProducts.length > 0 &&
              searchProducts.slice(0, page * 20).map((product) => {
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
            {searchProducts.length > 0 && (
              <Button
                block
                size="large"
                onClick={() => fetchProducts(search, page + 1)}
                style={{ marginRight: "66px", marginBottom: "20px" }}
              >
                {loadMore ? <LoadingOutlined /> : "Load More"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
