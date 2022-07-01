import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import MenuContent from "./MenuContent";

import { getCategories } from "../../functions/category";
import { getSubcats } from "../../functions/subcat";
import { getParents } from "../../functions/parent";

const initialState = {
  maxCategories: 7,
  maxSubcats: 7,
  maxParents: 7,
  minPrice: 0,
  maxPrice: 0,
  categoryIds: [],
  subcatIds: [],
  parentIds: [],
};

const ShopMenu = ({ search, setSearch }) => {
  let dispatch = useDispatch();

  const { categories, subcats, parents, user } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const {
    price,
    category,
    subcategory,
    parent,
  } = search;

  const [menus, setMenus] = useState({
    ...initialState,
    minPrice: price && price[0],
    maxPrice: price && price[1],
    categoryIds: category ? category : [],
    subcatIds: subcategory ? subcategory : [],
    parentIds: parent ? parent : [],
  });
  const [categoryList, setCategoryList] = useState([...categories]);
  const [subcatList, setSubcatList] = useState([...subcats]);
  const [parentList, setParentList] = useState([...parents]);

  const {
    minPrice,
    maxPrice,
    categoryIds,
    subcatIds,
    parentIds,
  } = menus;

  useEffect(() => {
    loadCategories();
    loadSubcats();
    loadParents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    if (typeof window !== undefined) {
      if (
        !localStorage.getItem("categories") ||
        !localStorage.getItem("products") ||
        !JSON.parse(localStorage.getItem("products")).length
      ) {
        getCategories(user.address ? user.address : {}).then((category) => {
          setCategoryList(category.data.categories);
          dispatch({
            type: "CATEGORY_LIST_VIII",
            payload: category.data.categories,
          });
          dispatch({
              type: "PRODUCT_LIST_XII",
              payload: category.data.products,
          });
        });
      }
    }
  };

  const loadSubcats = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("subcats")) {
        getSubcats().then((subcat) => {
          setSubcatList(subcat.data);
          dispatch({
            type: "SUBCAT_LIST_VII",
            payload: subcat.data,
          });
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
            type: "PARENT_LIST_VII",
            payload: parent.data,
          });
        });
      }
    }
  };

  const handlePrice = () => {
    setSearch({
      ...search,
      price: [
          minPrice ? parseFloat(minPrice) : 0,
          maxPrice ? parseFloat(maxPrice) : 999999999,
        ],
    });
  };

  const handleCategoryCheck = (e) => {
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }
    setMenus({
      ...menus,
      categoryIds: inTheState,
    });
    setSearch({
      ...search,
      category: inTheState ? inTheState : [],
    });
  };

  const handleStarClick = (num) => {
    setSearch({
      ...search,
      stars: num,
    });
  };

  const handleSubcatCheck = (e) => {
    let inTheState = [...subcatIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }
    setMenus({
      ...menus,
      subcatIds: inTheState,
    });
    setSearch({
      ...search,
      subcategory: inTheState ? inTheState : [],
    });
  };

  const handleParentCheck = (e) => {
    let inTheState = [...parentIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }
    setMenus({
      ...menus,
      parentIds: inTheState,
    });
    setSearch({
      ...search,
      parent: inTheState ? inTheState : [],
    });
  };

  return (
    <MenuContent
      menus={menus}
      setMenus={setMenus}
      categoryList={categoryList}
      subcatList={subcatList}
      parentList={parentList}
      handlePrice={handlePrice}
      handleCategoryCheck={handleCategoryCheck}
      handleStarClick={handleStarClick}
      handleSubcatCheck={handleSubcatCheck}
      handleParentCheck={handleParentCheck}
    />
  );
};

export default ShopMenu;
