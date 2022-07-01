import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Resizer from "react-image-file-resizer";
import reactImageSize from "react-image-size";
import axios from "axios";
import { toast } from "react-toastify";
import ImageCarouselLoad from "./ImageCarouselLoad";

const ImageCarousel = ({ values, setValues, loading, setLoading }) => {
    let dispatch = useDispatch();

    const { user } = useSelector((state) => ({ ...state }));

    const { carouselImages } = values;

    const fileUploadAndResize = (e) => {
        let files = e.target.files;
        let allUploadedFiles = carouselImages;

        if (files) {
            setLoading(true);
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(
                    files[i],
                    1120,
                    220,
                    "JPEG",
                    100,
                    0,
                    async (uri) => {
                        const { width, height } = await reactImageSize(uri);

                        if (width !== 1120 || height !== 220) {
                            toast.error(
                                "Carousel images should have an exact dimension of width: 1120 pixel, heigth: 220 pixel"
                            );
                            setLoading(false);
                            return;
                        }

                        axios
                            .post(
                                `${process.env.REACT_APP_API}/uploadimages`,
                                {
                                    image: uri,
                                },
                                {
                                    headers: {
                                        authtoken: user ? user.token : "",
                                    },
                                }
                            )
                            .then((res) => {
                                setLoading(false);
                                allUploadedFiles.push({ ...res.data, carouselURL: "", activation: true });

                                setValues({
                                    ...values,
                                    carouselImages: allUploadedFiles,
                                    activation: true,
                                });

                                dispatch({
                                    type: "ESTORE_INFO_II",
                                    payload: {
                                        carouselImages: allUploadedFiles,
                                        activation: true,
                                    },
                                });
                                axios.put(
                                    `${process.env.REACT_APP_API}/setting/imageupdate/${process.env.REACT_APP_ESTORE_ID}`,
                                    {
                                        carouselImages: allUploadedFiles,
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
                    },
                    "base64"
                );
            }
        }
    };

    return (
        <>
            <div className="p-3">
                <label>
                    <b>Image Carousel</b>
                </label>
                <br />

                <ImageCarouselLoad
                    values={values}
                    setValues={setValues}
                    loading={loading}
                    setLoading={setLoading}
                />

                <div className="text-left">
                    <label className="btn btn-secondary btn-raised mt-3">
                        CHOOSE IMAGE FILE
                        <input
                            type="file"
                            multiple
                            hidden
                            accept="images/*"
                            onChange={fileUploadAndResize}
                        />
                    </label>
                    <span style={{ color: "red", marginLeft: "10px" }}>Note: Make sure to upload an image exactly with width 1120 px and height 220 px</span>
                </div>
            </div>
        </>
    );
}

export default ImageCarousel;