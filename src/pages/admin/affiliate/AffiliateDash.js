import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CopyOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip } from 'antd';
import NumberFormat from "react-number-format";

import AdminNav from "../../../components/nav/AdminNav";
import AffiliateDashboard from "../../../components/forms/affiliate/AffiliateDashboard";
import AffiliateTable from "../../../components/forms/affiliate/AffiliateTable";
import ProspectTable from "../../../components/forms/affiliate/ProspectTable";
import AddDomain from "../../../components/common/addDomain";

import { getAffiliates } from "../../../functions/affiliate";

const initialState = {
  affiliates: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "createdAt",
  sort: -1,
  totalProducts: 0,
  totalCommission: 0,
  totalWithdrawn: 0,
  totalRemaining: 0
}

const AffiliateDash = () => {

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("Copy to Clipboard");
  const [tabMenu, setTabMenu] = useState(1);

  const { estore } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadAffiliates();
  }, [values.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAffiliates = () => {
    const { sortkey, sort, currentPage, pageSize } = values;
    setLoading(true);
    getAffiliates(sortkey, sort, currentPage, pageSize).then(res => {
      const sumOfCommission = res.data.sumCommission[0] ? res.data.sumCommission[0].sum : 0;
      const totalCommission = sumOfCommission;
      const totalWithdrawn = res.data.sumWithdraw[0] ? res.data.sumWithdraw[0].sum : 0;
      const totalRemaining = totalCommission + totalWithdrawn;
      setValues({
        ...values,
        affiliates: res.data.affiliates,
        itemsCount: res.data.count,
        totalProducts: res.data.totalProducts,
        totalCommission,
        totalWithdrawn,
        totalRemaining
      });
      setLoading(false);
    })
  }

  const copyClipboard = (num) => {
    const copyText = document.getElementById("myInput" + num);
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
    setCopied("Copied")
  }

  const tabs = {
    float: "left",
    padding: "5px 10px",
    borderTop: "1px solid #aaa",
    borderLeft: "1px solid #aaa",
    width: 80,
    textAlign: "center",
    cursor: "pointer",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">          
          <h4 style={{ margin: "20px 0" }}>Earnings</h4>
          <hr />

          <AffiliateDashboard
            values={values}
            loadAffiliates={loadAffiliates}
            totalRemaining={values.totalRemaining}
          />
          <br /><br />

          <div style={{borderBottom: "1px solid #aaa"}}>
            <div style={{...tabs, backgroundColor: tabMenu === 1 ? "#fff" : "#eee"}} onClick={() => setTabMenu(1)}>Details</div>
            <div style={{...tabs, borderRight: "1px solid #aaa", backgroundColor: tabMenu === 2 ? "#fff" : "#eee"}} onClick={() => setTabMenu(2)}>Prospects</div>
            <div style={{clear: "both"}}></div>
          </div>
          <br />

          {tabMenu === 1 && <>
            <AffiliateTable
              values={values}
              setValues={setValues}
              loading={loading}
              loadAffiliates={loadAffiliates}
              totalRemaining={values.totalRemaining}
            />
          </>}

          {tabMenu === 2 && <>
            <ProspectTable loading={loading} setLoading={setLoading} />
          </>}

          <br /><br />
          
          <h4 style={{ margin: "20px 0" }}>Affiliate Links</h4>
          <hr />

          <label>Live Free Training (every Wed and Sat 8PM)</label>
          <Input.Group compact>
            <Input
              style={{ width: '90%' }}
              defaultValue={`https://${estore.urlname1}.etnants.com`}
              id="myInput1"
            />
            <Tooltip title={copied}>
              <Button icon={<CopyOutlined />} onClick={() => copyClipboard(1)} />
            </Tooltip>
          </Input.Group><br />

          <label>OGPA Program Details</label>
          <Input.Group compact>
            <Input
              style={{ width: '90%' }}
              defaultValue={`https://${estore.urlname1}.etnants.com/ogpa`}
              id="myInput2"
            />
            <Tooltip title={copied}>
              <Button icon={<CopyOutlined />} onClick={() => copyClipboard(2)} />
            </Tooltip>
          </Input.Group><br />

          <label>OGPA Program Registration</label>
          <Input.Group compact>
            <Input
              style={{ width: '90%' }}
              defaultValue={`https://${estore.urlname1}.etnants.com/ogpaform`}
              id="myInput3"
            />
            <Tooltip title={copied}>
              <Button icon={<CopyOutlined />} onClick={() => copyClipboard(3)} />
            </Tooltip>
          </Input.Group>
          <br /><br />
          
          <h4 style={{ margin: "20px 0" }}>Commission Rate</h4>
          <hr />
          Commission Rate A:{" "}
          <NumberFormat
            value={1000}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"₱"}
          /> per OGPA Program Referrals<br />
          Commission Rate B: 10% of Referral's Monthly Subscription Fee<br />
          <br /><br />
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AffiliateDash;
