import React from "react";
import ShowingForms from "../../common/ShowingForms";

const HomepageSetting = ({ values, setValues }) => {

    const {
        showHomeCarousel,
        showRandomItems,
        showCategories,
        showNewArrival,
        showBestSeller,
    } = values;

    const handleChange = (value, prop) => {
        setValues({
            ...values,
            [prop]: value,
        })
    }

    const formProperty = [
        {
            type: "ant checked",
            name: "showcarousel",
            label: "Show Carousel",
            style: { marginBottom: "10px" },
            onChange: (e) => handleChange(e.target.checked, "showHomeCarousel"),
            value: showHomeCarousel,
            breakLine: true,
        },
        {
            type: "ant checked",
            name: "showrandomitems",
            label: "Show Random Items (This is the items right below the Text Carousel) ",
            style: { marginBottom: "10px" },
            onChange: (e) => handleChange(e.target.checked, "showRandomItems"),
            value: showRandomItems,
            breakLine: true,
        },
        {
            type: "ant checked",
            name: "catsubpar",
            label: "Show Categories, Sub Categories, and Parents",
            style: { marginBottom: "10px" },
            onChange: (e) => handleChange(e.target.checked, "showCategories"),
            value: showCategories,
            breakLine: true,
        },
        {
            type: "ant checked",
            name: "shownewarrival",
            label: "Show New Arrival",
            style: { marginBottom: "10px" },
            onChange: (e) => handleChange(e.target.checked, "showNewArrival"),
            value: showNewArrival,
            breakLine: true,
        },
        {
            type: "ant checked",
            name: "showbestseller",
            label: "Show Best Seller",
            style: { marginBottom: "10px" },
            onChange: (e) => handleChange(e.target.checked, "showBestSeller"),
            value: showBestSeller,
            breakLine: true,
        },
    ];

    return (
        <>
            <div className="pl-3">
                <label>
                    <b>Homepage Setting</b>
                </label>
                <br />
                <br />
            </div>
            <div className="pl-3">

                <ShowingForms formProperty={formProperty} />

            </div>
        </>
    );
}

export default HomepageSetting;