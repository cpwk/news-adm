import React from 'react';
import Utils from "../../common/Utils";

let CustcaseUtils = (() => {

    let currentPageKey = 'key-custcase-pageno';

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

export default CustcaseUtils;