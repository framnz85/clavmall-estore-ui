import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { toast } from "react-toastify";

import ShowingForms from "../common/ShowingForms";

import { bulkChangeReferral } from "../../functions/product";

const ReferralModal = ({
  values,
  changeReferralModal,
  setChangeReferralModal,
  handleCategoryChange,
  handleSubcatChange,
  handleParentChange
}) => {
  let dispatch = useDispatch();
  
  const [referral, setReferral] = useState("0");
  const [referraltype, setReferraltype] = useState("%");
  const [updatedProds, setUpdatedProds] = useState(false);
  const [loading, setLoading] = useState(false);

  const { categories, subcats, parents, user, estore } = useSelector((state) => ({
      ...state,
  }));

  const handleModal = () => {
    if (values.category) {
      setLoading(true);
      bulkChangeReferral({
        category: values.category,
        subcat: values.subcat,
        parent: values.parent,
        referral,
        referraltype
      }, user.token)
        .then(res => {
          setUpdatedProds(res.data.map(prod =>
            <div key={prod._id}>
              {prod.title.slice(0, 20)}... Referral Added!<br />
            </div>)
          );
          dispatch({
            type: "PRODUCT_LIST_XXI",
            payload: res.data,
          });
          setLoading(false);
        })
        .catch(error => {
          toast.error(error.message);
          setLoading(false);
        })
    } else {
      toast.error("It must have at least a Category and the Referral Commission value is greater than 0.")
    }
  };

  const handleModalClose = () => {
    setUpdatedProds(false);
    setChangeReferralModal(false);
  }

  const plainOptions = ["%", estore.country && estore.country.currency];

  let forCatOption = [...categories]
    forCatOption.unshift({ _id: "all", name: "- All Category -" });

  const formProperty = [
    {
        type: "select",
        name: "category",
        label: "Category",
        onChange: (e) => handleCategoryChange(e.target.value),
        disabled: loading,
        options: forCatOption
          .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
          .map(
            (category) =>
            (category = {
                ...category,
                key: category._id,
                value: category._id === "all" ? "" : category._id,
                text: category.name,
            })
        ),
        show: true,
    },
    {
        type: "select",
        name: "subcat",
        label: "Sub-Category",
        onChange: (e) => handleSubcatChange(e.target.value),
        disabled: loading,
        options: subcats.filter(subcat => subcat.parent === values.category)
          .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
          .map(
            (subcat) =>
            (subcat = {
                ...subcat,
                key: subcat._id,
                value: subcat._id === "all" ? "" : subcat._id,
                text: subcat.name,
            })
        ),
        show: true,
    },
    {
        type: "select",
        name: "parent",
        label: "Parent",
        onChange: (e) => handleParentChange(e.target.value),
        disabled: loading,
        options: parents.filter(parent => parent.parent === values.category)
          .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
          .map(
            (parent) =>
            (parent = {
                ...parent,
                key: parent._id,
                value: parent._id === "all" ? "" : parent._id,
                text: parent.name,
            })
        ),
        show: true,
    },
    {
      type: "number",
      name: "referral",
      label: "Referral Commission",
      onChange: (e) => setReferral(e.target.value),
      value: referral,
      radio: {
        label: "In: ",
        options: plainOptions,
        onChange: (e) => {
          setReferraltype(e.target.value);
        },
        value: referraltype
      },
      disabled: loading,
      show: true,
    },
  ]

  return (
    <>
      <Modal
        title="Choose what product's category, sub-category, and parent you want to change referral commission"
        visible={changeReferralModal}
        onOk={() => updatedProds ? handleModalClose() : handleModal()}
        okText={updatedProds ? "Done" : "Submit"}
        onCancel={() => handleModalClose()}
      >
        <ShowingForms formProperty={formProperty} />
        {updatedProds}
      </Modal>
    </>
  );
};

export default ReferralModal;
