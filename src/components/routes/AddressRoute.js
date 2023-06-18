import React, {useState} from "react";
import { Route } from "react-router";
import { useSelector } from "react-redux";

import LocationModal from "../modal/LocationModal";

const AddressRoute = ({ children, ...rest }) => {
  const [locModalVisible, setLocModalVisible] = useState(true);

  const { user } = useSelector((state) => ({ ...state }));

  return user && user.address && user.address.addiv3
    ? <Route {...rest} />
    : <LocationModal locModalVisible={locModalVisible} setLocModalVisible={setLocModalVisible} />;
};

export default AddressRoute;
