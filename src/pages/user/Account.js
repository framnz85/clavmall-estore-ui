import React from "react";

import UserNav from "../../components/nav/UserNav";
import ProfileDetails from "../../components/user/account/ProfileDetails";
import EmailUpdate from "../../components/user/account/EmailUpdate";
import PasswordUpdate from "../../components/user/account/PasswordUpdate";

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
        </div>
      </div>
    </div>
  );
};

export default Account;
