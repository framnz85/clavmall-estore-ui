import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Input, Checkbox } from "antd";
import {
  DollarOutlined,
  CaretRightOutlined,
  DownSquareOutlined,
  StarOutlined,
  TagsOutlined,
  WindowsOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import Star from "./Star";

const { SubMenu, Item } = Menu;

const MenuContent = ({
  menus,
  setMenus,
  categoryList,
  subcatList,
  parentList,
  handlePrice,
  handleCategoryCheck,
  handleStarClick,
  handleSubcatCheck,
  handleParentCheck,
}) => {

  const {
    maxCategories,
    maxSubcats,
    maxParents,
    minPrice,
    maxPrice,
    categoryIds,
    subcatIds,
    parentIds,
  } = menus;

  const showCategories = (maxShow) =>
    categoryList
      .filter(category => category._id !== "all")
      .sort((x, y) => {
          if (x.name < y.name) {return -1;}
          if (x.name > y.name) {return 1;}
          return 0;
      })
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
          {cat.name.length > 13
            ? cat.name.slice(0, 13) + "..."
            : cat.name + Array(10).fill("\xa0").join("")}
        </Checkbox>
      ));

  const showSubcats = (maxShow) => 
    subcatList
      .filter(subcat => subcat._id !== "all")
      .sort((x, y) => {
          if (x.name < y.name) {return -1;}
          if (x.name > y.name) {return 1;}
          return 0;
      })
      .slice(0, maxShow ? maxShow : subcatList.length)
      .map((sub) => (
        <Checkbox
          onChange={handleSubcatCheck}
          key={sub._id}
          className="m-0 p-0 mb-1"
          value={sub._id}
          name="subcategory"
          checked={subcatIds.includes(sub._id)}
        >
          {sub.name ? sub.name.length > 13
            ? sub.name.slice(0, 13) + "..."
            : sub.name + Array(10).fill("\xa0").join("")
            : ""
          }
        </Checkbox>
      ));

  const showParents = (maxShow) =>
    parentList
      .filter(parent => parent._id !== "all")
      .sort((x, y) => {
          if (x.name < y.name) {return -1;}
          if (x.name > y.name) {return 1;}
          return 0;
      })
      .slice(0, maxShow ? maxShow : parentList.length)
      .map((par) => (
        <Checkbox
          onChange={handleParentCheck}
          key={par._id}
          className="m-0 p-0 mb-1"
          value={par._id}
          name="parent"
          checked={parentIds.includes(par._id)}
        >
          {par.name.length > 13
            ? par.name.slice(0, 13) + "..."
            : par.name + Array(10).fill("\xa0").join("")}
        </Checkbox>
      ));
  
  const refreshSearchMenu = () => {
    setMenus({
      minPrice: "",
      maxPrice: "",
      categoryIds: [],
      subcatIds: [],
      parentIds: [],
    });
    window.location.href = "/shop";
  }
  
  return (
    <>
    <div className="bg-white" style={{textAlign: "center", padding: "10px 0px"}}>
      <Link to="/shop" onClick={() => refreshSearchMenu()}>
        <ReloadOutlined /> Refresh Filter
      </Link>
    </div>
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
            onChange={(e) => setMenus({
              ...menus,
              minPrice: e.target.value,
            })}
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
            onChange={(e) => setMenus({
              ...menus,
              maxPrice: e.target.value,
            })}
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
          <Item key="viewCategory" onClick={() => setMenus({
              ...menus,
              maxCategories: undefined,
            })}>
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
          <Item key="viewSubcats" onClick={() => setMenus({
              ...menus,
              maxSubcats: undefined,
            })}>
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
          <Item key="viewParents" onClick={() => setMenus({
              ...menus,
              maxParents: undefined,
            })}>
            View More
          </Item>
        )}
      </SubMenu>
    </Menu>
    </>
     );
}
 
export default MenuContent;