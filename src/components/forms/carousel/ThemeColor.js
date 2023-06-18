import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Radio } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const themeColors = [
    { head: "#009A57", txt: "" },
    { head: "#4169E1", txt: "#ceebfd" },
    { head: "#DC143C", txt: "#ffd4cc" },
    { head: "#ff6933", txt: "#ffdacc" },
    { head: "#8A2BE2", txt: "#e6d2f9" },
    { head: "#333333", txt: "#d9d9d9" },
    { head: "#a52a2a", txt: "#f5d6d6" },
    { head: "#ccad00", txt: "#fffbe6" },
];

const ThemeColor = ({ values, setValues }) => {
    let dispatch = useDispatch();

    const { estore } = useSelector((state) => ({ ...state }));

    const onColorChange = (e) => {
        const index = themeColors.findIndex(
            (color) => color.head === e.target.value
        );

        setValues({
            ...values,
            headerColor: e.target.value,
            carouselColor: themeColors[index].txt,
        });
        dispatch({
            type: "ESTORE_INFO_IV",
            payload: {
                headerColor: e.target.value,
                carouselColor: themeColors[index].txt,
            },
        });
    };

    return (
        <>
            <div className="p-3">
                <label>
                    <b>Theme Color</b>
                </label>
                <br />

                <Radio.Group
                    defaultValue={estore.headerColor}
                    size="large"
                    onChange={onColorChange}
                >
                    {themeColors.map((color) => (
                        <Radio.Button
                            value={color.head}
                            key={color.head}
                            style={{
                                color: "#ffffff",
                                backgroundColor: color.head,
                                width: "80px",
                            }}
                        >
                            {color.head === estore.headerColor ? (
                                <CheckCircleOutlined style={{ fontSize: "20px" }} />
                            ) : (
                                <span
                                    style={{
                                        color: color.head,
                                    }}
                                >
                                    .
                                </span>
                            )}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>
        </>
    );
}

export default ThemeColor;