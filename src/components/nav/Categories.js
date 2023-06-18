import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { MenuOutlined, RightOutlined } from "@ant-design/icons";
import { isMobile } from 'react-device-detect';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const initialCat = {
    page: 1,
    pageCount: 10,
    totalPages: 0,
}

const Categories = () => {
    let history = useHistory();

    const [showMenu, setShowMenu] = useState(isMobile ? false : true);
    const [catPage, setCatPage] = useState(initialCat);

    const { categories, subcats } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        setCatPage({
            ...catPage,
            totalPages: parseInt(categories.length / catPage.pageCount) + 1
        })
    }, [categories]); // eslint-disable-line react-hooks/exhaustive-deps

    return ( 
        <nav>
            <ul className="menu">
                <li className="main-menu">
                    <div
                        className="menuicon"
                        style={{ padding: isMobile ? "5px 0 5px 10px" : "5px 15px" }}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MenuOutlined />
                    </div>
                    {showMenu && <ul className="submenu" style={{ minWidth: isMobile ? "180px" : "240px" }}>
                        <li>
                            <div
                                style={{ textAlign: "center", padding: 0 }}
                                onClick={() => {
                                    if (catPage.page > 1)
                                        setCatPage({ ...catPage, page: catPage.page - 1 })
                                }}
                            >
                                <CaretUpOutlined style={{color: catPage.page === 1 ? "#cccccc" : "#333333"}} />
                            </div>
                        </li>
                        {categories && categories
                            .sort((a,b) => a.name - b.name)
                            .slice((catPage.page - 1) * catPage.pageCount, catPage.page * catPage.pageCount)
                            .map(cat => {
                            const subCategories = subcats && subcats.filter(sub => sub.parent === cat._id);
                            return <li key={cat._id}>
                                <div onClick={() => history.push(`/category/${cat.slug}`)}>
                                    {cat.name} <RightOutlined style={{ fontSize: "9px", float: "right", color: "#bbbbbb" }} />
                                </div>
                                <ul className="sub-submenu" style={{minWidth: isMobile ? "180px" : "240px", height: 600, overflowX: "auto"}}>
                                    {subCategories && subCategories.map(sub =>
                                        <li key={sub._id}>
                                            <div onClick={() => {
                                                history.push(`/subcats/${sub.slug}`);
                                                if (isMobile) setShowMenu(false);
                                            }}
                                            >
                                                {sub.name}
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        })}
                        <li>
                            <div
                                style={{ textAlign: "center", padding: 0 }}
                                onClick={() => {
                                    if (catPage.page < catPage.totalPages)
                                        setCatPage({ ...catPage, page: catPage.page + 1 })
                                }}
                            >
                                <CaretDownOutlined style={{color: catPage.page === catPage.totalPages ? "#cccccc" : "#333333"}} />
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ textAlign: "center", padding: 0, marginBottom: 5 }}
                                onClick={() => setShowMenu(false)}
                            >
                                Close (x)
                            </div>
                        </li>
                    </ul>}
                </li>
            </ul>
        </nav>
     );
}
 
export default Categories;