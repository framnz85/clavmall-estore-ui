import React from "react";

import UserNav from "../../components/nav/UserNav";
import ProfileDetails from "../../components/user/account/ProfileDetails";
import EmailUpdate from "../../components/user/account/EmailUpdate";
import PasswordUpdate from "../../components/user/account/PasswordUpdate";
import CreateStore from "../../components/common/CreateStore";

const Account = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <UserNav />
        </div>
        
        <div className="col-md-10 bg-white mt-3 mb-5">
          <ProfileDetails />
          <EmailUpdate />
          <PasswordUpdate />
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <CreateStore />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
