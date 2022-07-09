import React from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";

import AntCheckbox from "../common/form/AntCheckbox";
import { getAllMyAddiv1 } from "../../functions/addiv1";
import { getAllMyAddiv2 } from "../../functions/addiv2";
import { getAllMyAddiv3 } from "../../functions/addiv3";

const SameAddress = ({
    address,
    setAddiv1s,
    setAddiv2s,
    setAddiv3s,
    setLoading,
    homeAddress,
    setHomeAddress,
    initialHomeAddress,
    setAddressSaved
}) => {
    let dispatch = useDispatch();

    const { location } = useSelector((state) => ({
        ...state,
    }));

    const loadAddressesForHome = (address) => {
        const country = address.country ? address.country : {};
        const addiv1 = address.addiv1 ? address.addiv1 : {};
        const addiv2 = address.addiv2 ? address.addiv2 : {};

        const addiv1s = location.addiv1s && location.addiv1s.filter((addiv1) =>
            addiv1.couid === country._id
        );

        if (addiv1s && addiv1s.length > 0) {
            setAddiv1s(addiv1s);
        } else {
            getAllMyAddiv1(country._id, country.countryCode).then((res) => {
                setAddiv1s(res.data);
                dispatch({
                type: "LOCATION_LIST_II",
                payload: { addiv1s: res.data },
                });
            });
            }

            const addiv2s = location.addiv2s && location.addiv2s.filter((addiv2) =>
            addiv2.adDivId1 === addiv1._id
        );

        if (addiv2s && addiv2s.length > 0) {
            setAddiv2s(addiv2s);
        } else {
            setLoading(true);
            getAllMyAddiv2(country._id, addiv1._id, country.countryCode).then(
                (res) => {
                setAddiv2s(res.data);
                dispatch({
                    type: "LOCATION_LIST_II",
                    payload: { addiv2s: res.data },
                });
                setLoading(false);
                }
            );
            }

            const addiv3s = location.addiv3s && location.addiv3s.filter((addiv3) =>
            addiv3.adDivId2 === addiv2._id
        );

        if (addiv3s && addiv3s.length > 0) {
            setAddiv3s(addiv3s);
        } else {
            setLoading(true);
            getAllMyAddiv3(
                country._id,
                addiv1._id,
                addiv2._id,
                country.countryCode
            ).then((res) => {
                setAddiv3s(res.data);
                dispatch({
                type: "LOCATION_LIST_II",
                payload: { addiv3s: res.data },
                });
                setLoading(false);
            });
        }
    }

    return ( 
            <AntCheckbox inputProperty={{
                label: "Same as Delivery Address",
                onChange: (e) => {
                    if(e.target.checked)
                    {
                        setHomeAddress(address);
                        loadAddressesForHome(address);
                    }
                    else
                    {
                        setHomeAddress(initialHomeAddress);
                    }
                    setAddressSaved(false);
                },
                value: _.isEqual(
                    { ...address.addiv3, ...address.details }
                    , { ...homeAddress.addiv3, ...homeAddress.details }
                ),
        }} />
    );
}
 
export default SameAddress;