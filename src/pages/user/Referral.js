import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CopyOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip } from 'antd';
import { toast } from "react-toastify";

import UserNav from "../../components/nav/UserNav";
import ReferralDashboard from "../../components/user/referral/ReferralDashboard";
import ReferralOrder from "../../components/user/referral/ReferralOrder";
import UsersReferred from "../../components/user/referral/UsersReferred";
import ReferralCommission from "../../components/user/referral/ReferralCommission";
import CreateStore from "../../components/common/CreateStore";

import { getCommissions } from "../../functions/referral";

const initialState = {
  commissions: [],
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

const ReferralProgram = () => {

  const [values, setValues] = useState(initialState);
  const [copied, setCopied] = useState("Copy to Clipboard");
  const [tabMenu, setTabMenu] = useState(1);
  const [loading, setLoading] = useState(false);

  const { user, estore } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadCommissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCommissions = () => {
    const { sortkey, sort, currentPage, pageSize } = values;
    setLoading(true);
    getCommissions(sortkey, sort, currentPage, pageSize, user.token).then(res => {
      if (res.data.err) {
        toast.error(res.data.err);
        setLoading(false);
      } else {
        const commissions = res.data.commissions;
        const sumOfCommission = commissions.length ? commissions.map(item =>
          item.status === "Approved" && parseFloat(item.commission) > 0 && parseFloat(item.commission)
        ).reduce((prev, next) => prev + next) : 0;
        const totalCommission = sumOfCommission;
        const totalWithdrawn = commissions.length ? commissions.map(item =>
          item.status === "Approved" && parseFloat(item.commission) < 0 && Math.abs(parseFloat(item.commission))
        ).reduce((prev, next) => prev + next) : 0;
        const totalRemaining = totalCommission - totalWithdrawn;
        setValues({
          ...values,
          commissions,
          totalProducts: commissions.length,
          totalCommission: totalCommission ? totalCommission : 0,
          totalWithdrawn: totalWithdrawn ? totalWithdrawn : 0,
          totalRemaining: totalRemaining ? totalRemaining : 0,
        });
        setLoading(false);
      }
    })
  }

  const copyClipboard = (inputs) => {
    const copyText = document.getElementById(inputs);
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
          <UserNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">          
          <h4 style={{ margin: "20px 0" }}>Earnings</h4>
          <hr />
        
          <ReferralDashboard values={values} loadCommissions={loadCommissions} totalRemaining={values.totalRemaining} />
          <br /><br />

          <div style={{borderBottom: "1px solid #aaa"}}>
            <div style={{...tabs, backgroundColor: tabMenu === 1 ? "#fff" : "#eee"}} onClick={() => setTabMenu(1)}>Details</div>
            <div style={{...tabs, backgroundColor: tabMenu === 2 ? "#fff" : "#eee"}} onClick={() => setTabMenu(2)}>Orders</div>
            <div style={{...tabs, borderRight: "1px solid #aaa", backgroundColor: tabMenu === 3 ? "#fff" : "#eee"}} onClick={() => setTabMenu(3)}>Referrals</div>
            <div style={{clear: "both"}}></div>
          </div>
          <br />

          {tabMenu === 1 && <>
            <ReferralCommission values={values} loading={loading} />
          </>}

          {tabMenu === 2 && <>
            <ReferralOrder />
          </>}

          {tabMenu === 3 && <>
            <UsersReferred />
          </>}

          <br /><br />
          
          <h4 style={{ margin: "20px 0" }}>Ids & Links</h4>
          <hr />

          <label>Referral Link</label>
          <Input.Group compact>
            <Input
              style={{ width: '90%' }}
              defaultValue={
                estore.planType === "plan-1"
                  ? `https://${estore.urlname1}.clavstore.com/?refid=${user._id}`
                  : `https://${estore.urlname1}.com/?refid=${user._id}`
              }
              id="myInput1"
            />
            <Tooltip title={copied}>
              <Button icon={<CopyOutlined />} onClick={() => copyClipboard("myInput1")} />
            </Tooltip>
          </Input.Group><br />
          
          <label>Referral ID</label>
          <Input.Group compact>
            <Input
              style={{ width: '90%' }}
              defaultValue={user._id}
              id="myInput2"
            />
            <Tooltip title={copied}>
              <Button icon={<CopyOutlined />} onClick={() => copyClipboard("myInput2")} />
            </Tooltip>
          </Input.Group>
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <CreateStore />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
