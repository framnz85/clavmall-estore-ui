import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import ImageCarouselProperty from "./ImageCarouselProperty";

import { getCategories, getCategorySubcats } from "../../../functions/category";
import { getParents } from "../../../functions/parent";

const ImageCarouselLoad = ({ values, setValues, setLoading }) => {
    let dispatch = useDispatch();

    const [subcatOptions, setSubcatOptions] = useState([]);

    const { estore, user, categories } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategories();
        loadParents();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadCategories = () => {
        if (typeof window !== undefined) {
            if (!localStorage.getItem("categories")) {
                getCategories().then((category) => {
                    dispatch({
                        type: "CATEGORY_LIST_III",
                        payload: category.data.categories,
                    });
                    dispatch({
                        type: "PRODUCT_LIST_II",
                        payload: category.data.products,
                    });
                });
            }
        }
    };

    const loadParents = () => {
        if (typeof window !== undefined) {
            if (!localStorage.getItem("parents")) {
                getParents().then((parent) => {
                    dispatch({
                        type: "PARENT_LIST_II",
                        payload: parent.data,
                    });
                });
            }
        }
    };

    const handleActivateChange = (public_id, value) => {
        setValues({
            ...values,
            carouselImages: values.carouselImages.map(image =>
                image.public_id === public_id
                    ? { ...image, activation: value }
                    : image
            ),
        });
    }

    const handleFolderChange = (public_id, value) => {
        setValues({
            ...values,
            carouselImages: values.carouselImages.map(image =>
                image.public_id === public_id
                    ? { ...image, carouselURL: value + "/" }
                    : image
            ),
        })
    }

    const handleChildChange = (public_id, value1, value2) => {
        setValues({
            ...values,
            carouselImages: values.carouselImages.map(image =>
                image.public_id === public_id
                    ? { ...image, carouselURL: value1 + "/" + value2 }
                    : image
            ),
        })
        if (value1 === "category") {
            const catid = categories.filter(cat => cat.slug === value2);

            getCategorySubcats(catid[0]._id).then((res) => {
                setSubcatOptions(res.data);
                dispatch({
                    type: "SUBCAT_LIST_II",
                    payload: res.data,
                });
            });
        }
    }


    const handleImageRemove = (public_id) => {
        setLoading(true);
        axios
            .post(
                `${process.env.REACT_APP_API}/removeimage`,
                {
                    public_id,
                },
                {
                    headers: {
                        authtoken: user ? user.token : "",
                    },
                }
            )
            .then((res) => {
                setLoading(false);
                const { carouselImages } = estore;
                let filteredImages = carouselImages.filter((item) => {
                    return item.public_id !== public_id;
                });

                setValues({
                    ...values,
                    carouselImages: filteredImages,
                });

                dispatch({
                    type: "ESTORE_INFO_III",
                    payload: { carouselImages: filteredImages },
                });
                axios.put(
                    `${process.env.REACT_APP_API}/setting/imageupdate/${process.env.REACT_APP_ESTORE_ID}`,
                    {
                        carouselImages: filteredImages,
                    },
                    {
                        headers: {
                            authtoken: user ? user.token : "",
                        },
                    }
                );
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    };

    return (

        <ImageCarouselProperty
            values={values}
            subcatOptions={subcatOptions}
            handleActivateChange={handleActivateChange}
            handleFolderChange={handleFolderChange}
            handleChildChange={handleChildChange}
            handleImageRemove={handleImageRemove}
        />

    );
}

export default ImageCarouselLoad;