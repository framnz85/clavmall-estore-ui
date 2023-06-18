import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Radio } from "antd";
import { toast } from "react-toastify";

import ShowingForms from "../common/ShowingForms";

import { bulkChangeStatus } from "../../functions/product";

const StatusModal = ({
  values,
  changeStatusModal,
  setChangeStatusModal,
  handleCategoryChange,
  handleSubcatChange,
  handleParentChange
}) => {
  let dispatch = useDispatch();
  
  const [status, setStatus] = useState(true);
  const [updatedProds, setUpdatedProds] = useState(false);
  const [loading, setLoading] = useState(false);

  const { categories, subcats, parents, user } = useSelector((state) => ({
      ...state,
  }));

  const handleModal = () => {
    if (values.category) {
      setLoading(true);
      bulkChangeStatus({
        category: values.category,
        subcat: values.subcat,
        parent: values.parent,
        status
      }, user.token)
        .then(res => {
          setUpdatedProds(res.data.map(prod =>
            <div key={prod._id}>
              {prod.title.slice(0, 20)}... Status changed!<br />
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
      toast.error("It must have at least a Category before changing the status.")
    }
  };

  const handleModalClose = () => {
    setUpdatedProds(false);
    setChangeStatusModal(false);
  }

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
  ]

  return (
    <>
      <Modal
        title="Choose what product's category, sub-category, and parent you want to change status"
        visible={changeStatusModal}
        onOk={() => updatedProds ? handleModalClose() : handleModal()}
        okText={updatedProds ? "Done" : "Submit"}
        onCancel={() => handleModalClose()}
      >
        <ShowingForms formProperty={formProperty} />
        <Radio.Group defaultValue={status} buttonStyle="solid" onChange={(e) => setStatus(e.target.value)}>
          <Radio.Button value={true}>All On</Radio.Button>
          <Radio.Button value={false}>All Off</Radio.Button>
        </Radio.Group>
        
        {updatedProds}
      </Modal>
    </>
  );
};

export default StatusModal;
