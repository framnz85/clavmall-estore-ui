let inititalAddress = {
  couid: {},
  addiv1: {},
  addiv2: {},
  addiv3: {},
};

const filterProductsAddress = (products, address) => {
    address = { ...inititalAddress, ...address };
    products = products.filter(p => {
        const noAvail = p.noAvail.map(nA => {
            return { couid: nA.couid, addiv1: nA.addiv1, addiv2: nA.addiv2, addiv3: nA.addiv3}
        });
        const existLoc = noAvail.filter(loc =>
            loc.couid === address.addiv3.couid
            && loc.addiv1 === address.addiv3.adDivId1
            && loc.addiv2 === address.addiv3.adDivId2
            && loc.addiv3 === address.addiv3._id
        )
        return !existLoc[0];
    })
    products = products.filter(p => {
        const noAvail = p.noAvail.map(nA => {
            return { couid: nA.couid, addiv1: nA.addiv1, addiv2: nA.addiv2, addiv3: nA.addiv3}
        });
        const existLoc = noAvail.filter(loc =>
            loc.couid === address.addiv3.couid
            && loc.addiv1 === address.addiv3.adDivId1
            && loc.addiv2 === address.addiv3.adDivId2
            && loc.addiv3 === undefined
        )
        return !existLoc[0];
    })
    products = products.filter(p => {
        const noAvail = p.noAvail.map(nA => {
            return { couid: nA.couid, addiv1: nA.addiv1, addiv2: nA.addiv2, addiv3: nA.addiv3}
        });
        const existLoc = noAvail.filter(loc =>
            loc.couid === address.addiv3.couid
            && loc.addiv1 === address.addiv3.adDivId1
            && loc.addiv2 === undefined
            && loc.addiv3 === undefined
        )
        return !existLoc[0];
    })
    products = products.filter(p => p.activate === true);
    
    return products;
}

export default filterProductsAddress;