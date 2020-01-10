import React from 'react';
import ReactDOM from 'react-dom';
import {LocaleProvider} from 'antd';
import {CTYPE, KvStorage} from "./index";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import NProgress from 'nprogress';
import ImgEditor from "./ImgEditor";

let Utils = (function () {

    let _setCurrentPage = (key, pageno) => {
        sessionStorage.setItem(key, pageno);
    };

    let _getCurrentPage = (key) => {
        return sessionStorage.getItem(key) ? parseInt(sessionStorage.getItem(key)) : 1
    };

    let common = (() => {

        let renderReactDOM = (child, options = {}) => {

            let div = document.createElement('div');
            let {id} = options;
            if (id) {
                let e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                div.setAttribute('id', id);
            }

            document.body.appendChild(div);
            ReactDOM.render(<LocaleProvider locale={zhCN}>{child}</LocaleProvider>, div);
        };

        let closeModalContainer = (id_div) => {
            let e = document.getElementById(id_div);
            if (e) {
                document.body.removeChild(e);
            }
        };

        let createModalContainer = (id_div) => {
            //强制清理同名div，render会重复创建modal
            closeModalContainer(id_div);
            let div = document.createElement('div');
            div.setAttribute('id', id_div);
            document.body.appendChild(div);
            return div;
        };

        let showImgEditor = (aspectRatio, img, syncImg) => {
            common.renderReactDOM(<ImgEditor aspectRatio={aspectRatio} img={img}
                                             syncImg={syncImg}/>, {id: 'div-img-editor'});
        };

        return {
            renderReactDOM, closeModalContainer, createModalContainer, showImgEditor
        }
    })();

    let pager = (() => {

        let convert2Pagination = (result) => {

            let {pageable} = result;
            let {totalElements} = result;
            let pageSize = pageable.pageSize || CTYPE.pagination.pageSize;
            let current = pageable.offset / pageable.pageSize + 1;
            let totalPages = Math.ceil(totalElements / pageable.pageSize);
            return {
                current,
                total: totalElements, totalPages,
                pageSize
            }
        };

        return {convert2Pagination}

    })();

    let nProgress = (() => {
        NProgress.configure({showSpinner: false});
        return {
            start: () => {
                NProgress.start();
            },
            done: () => {
                NProgress.done();
            },
        }
    })();

    let adminPermissions = null;

    let adm = (() => {

        let avatar = (img) => {
            return img ? img : require('../assets/image/common/logo_square.png');
        };

        let savePermissions = (permissions) => {
            KvStorage.set('admin-permissions', permissions);
            initPermissions();
        };

        let getPermissions = () => {
            return KvStorage.get('admin-permissions') || '';
        };

        let authPermission = (f) => {
            return getPermissions().includes(f);
        };

        let initPermissions = () => {
            if (getPermissions() === '') {
                return;
            }
            Utils.adminPermissions = {

                ROLE_EDIT: authPermission('ROLE_EDIT'),
                ADMIN_EDIT: authPermission('ADMIN_EDIT'),
                ADMIN_LIST: authPermission('ADMIN_LIST'),

                BANNER_EDIT: authPermission('BANNER_EDIT'),
                ARTICLE_EDIT: authPermission('ARTICLE_EDIT'),
                CUSTCASE_EDIT: authPermission('CUSTCASE_EDIT'),
                CUSTEVAL_EDIT: authPermission('CUSTEVAL_EDIT')
            }
        };

        let clearPermissions = () => {
            Utils.adminPermissions = null;
            KvStorage.remove('admin-permissions');
        };

        return {avatar, savePermissions, initPermissions, clearPermissions}

    })();

    return {
        common, pager, nProgress, adm, adminPermissions, _setCurrentPage, _getCurrentPage
    };


})();

export default Utils;