import React from 'react';
import Utils from "../../common/Utils";

let CustevalUtils = (() => {

    let currentPageKey = 'key-custeval-pageno';

    let setCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentPageKey, pageno);
    };

    let getCurrentPage = () => {
        return Utils._getCurrentPage(currentPageKey);
    };

    return {
        setCurrentPage, getCurrentPage,
    }

})();

export default CustevalUtils;