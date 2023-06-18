import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

import AdminNav from "../../../components/nav/AdminNav";
import ShowingForms from "../../../components/common/ShowingForms";
import Expiration from "../../../components/forms/subscription/Expiration";
import AutoRenew from "../../../components/forms/subscription/AutoRenew";
import BillingHistory from "../../../components/forms/subscription/BillingHistory";
import AddDomain from "../../../components/common/addDomain";
import { toast } from "react-toastify";

const initialState = {
  cycleId: "0",
  cycleType: "",
  totalPrice: "",
  payStatus: "pending",
  duration: "",
  planId: "",
  payment: "recurring",
  domainName: "",
};

const SubscriptionPage = () => {
  const [values, setValues] = useState(initialState);
  const [renewal, setRenewal] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [domainAvail, setDomainAvail] = useState(true);

  const { estore } = useSelector((state) => ({
    ...state,
  }));

  const priceOption1 = [
    {
      _id: "0",
      description: "- Select Period -",
      price: "0",
      duration: 0,
      plan_id: "",
    },
    {
      _id: "3",
      description: "$9/mo for 1 month = $9",
      price: "9",
      duration: 31,
      plan_id: "P-3CR947379G2203352ML6HI6Q",
    },
    {
      _id: "2",
      description: "$7.5/mo for 6 months = $45",
      price: "45",
      duration: 183,
      plan_id: "P-6HK58614V00205713ML6NBFQ",
    },
    {
      _id: "1",
      description: "$6/mo for 1 year = $72 (w/ Domain Name)",
      price: "72",
      duration: 366,
      plan_id: "P-45J88409K5472334HML6NHJA",
    },
    {
      _id: "4",
      description: "$348 setup fee and $72/yr (Domain Name + Mobile App)",
      price: "348",
      duration: 366,
      plan_id: "P-8JD73803P7038315WMQA2VOA",
    },
  ];

  // const priceOption1 = [
  //     { _id: "0", description: "- Select Period -", price: "0", duration: 0, plan_id: '' },
  //     { _id: "1", description: "$12/mo for 1 year = $144", price: "144", duration: 366, plan_id: 'P-59V97378B41489711ML6O72I' },
  //     { _id: "2", description: "$15/mo for 6 months = $90", price: "90", duration: 183, plan_id: 'P-67L51281J28737919ML6O7VI' },
  //     { _id: "3", description: "$19/mo for 1 month = $19", price: "19", duration: 31, plan_id: 'P-978338096T7690635ML6O67Q' },
  // ];

  const handleChange = (value) => {
    const result = priceOption1.filter((price) => price._id === value);
    if (result[0]) {
      setValues({
        ...values,
        cycleId: result[0]._id,
        cycleType: result[0].description,
        totalPrice: result[0].price,
        payStatus: "not paid",
        duration: result[0].duration,
        planId: result[0].plan_id,
      });
    }
    if (value === "1" || value === "4") {
      setDomainAvail(false);
    } else {
      setDomainAvail(true);
    }
  };

  const checkDomainAvail = async () => {
    if (domainName) {
      const apiKey = "at_pjYcT47ufIQtIueFjzIn8uUKY95mE";
      const url =
        "https://domain-availability.whoisxmlapi.com/api/v1?apiKey=" +
        apiKey +
        "&domainName=" +
        domainName;
      await axios
        .get(url)
        .then((response) => {
          const available = response.data.DomainInfo.domainAvailability;
          if (available === "UNAVAILABLE") {
            setDomainAvail(false);
            toast.error(`Sorry, ${domainName} is not availble`);
          } else {
            setValues({ ...values, domainName });
            setDomainAvail(true);
            toast.success(`Yes! ${domainName} is available`);
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const formProperty = [
    {
      type: "select",
      name: "planType",
      label: "Choose Payment Plan",
      onChange: (e) => handleChange(e.target.value),
      options: priceOption1.map(
        (price) =>
          (price = {
            ...price,
            key: price._id,
            value: price._id,
            text: price.description,
          })
      ),
      disabled: loading,
      show: true,
    },
    {
      type: "text",
      name: "domainname",
      label: "Domain Name",
      onChange: (e) => setDomainName(e.target.value),
      value: domainName,
      disabled: loading,
      show:
        (values.cycleId === "1" || values.cycleId === "4") &&
        estore.planType === "plan-1",
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>My Subscription</h4>
          <hr />

          {loading && (
            <h4 style={{ margin: "20px 0" }}>
              <LoadingOutlined />
            </h4>
          )}

          <Expiration />

          <h4 style={{ margin: "20px 0" }}>Add / Pay Subscription</h4>
          <hr />
          <br />

          <ShowingForms formProperty={formProperty} />

          {(values.cycleId === "1" || values.cycleId === "4") &&
            estore.planType === "plan-1" && (
              <>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => checkDomainAvail()}
                >
                  Check Domain Availability
                </button>
                <br />
                <br />
              </>
            )}

          {(values.cycleId === "2" || values.cycleId === "3") &&
            estore.planType === "plan-1" && (
              <>
                <span style={{ color: "red" }}>
                  Choosing 1 year subscription will get you a free Domain Name.{" "}
                  <a
                    href={`https://ogpa.clavstore.com/article/url-name-upgrade/?url=${estore.urlname1}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LEARN MORE
                  </a>
                </span>
                <br />
                <br />
              </>
            )}

          <AutoRenew
            values={values}
            setValues={setValues}
            initialState={initialState}
            renewal={renewal}
            setRenewal={setRenewal}
            priceOption1={priceOption1}
            setLoading={setLoading}
            domainAvail={domainAvail}
          />
          <br />
          <br />
          <br />

          <h4 style={{ margin: "20px 0" }}>Billing History</h4>

          <BillingHistory />
          <br />
          <br />

          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
