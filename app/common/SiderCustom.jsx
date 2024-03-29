import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import CTYPE from "./CTYPE";
import {Utils} from ".";


const {Sider} = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {

    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: false
    };

    componentDidMount() {
        this.setMenuOpen();
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }

    getPostion = (str, cha, num) => {
        let x = str.indexOf(cha);
        for (let i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    };

    setMenuOpen = () => {

        let path = window.location.hash.split('#')[1];

        //兼容三层目录,三级页不修改，刷新时定位到一级
        let key = path.substr(0, path.lastIndexOf('/'));
        if (key.split('/').length > 3) {
            if (this.state.openKey)
                return;
            key = key.substring(0, this.getPostion(key, '/', 2));
        }

        this.setState({
            openKey: key,
            selectedKey: path
        });
    };

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline'
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });

    };

    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false
        })
    };

    render() {

        let {ADMIN_LIST, ROLE_EDIT, BANNER_EDIT, ARTICLE_EDIT, CUSTCASE_EDIT, CUSTEVAL_EDIT} = Utils.adminPermissions;


        let {firstHide, selectedKey, openKey} = this.state;

        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto'}}>
                <div className={this.props.collapsed ? 'logo logo-s' : 'logo'}/>
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}>

                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="home"/><span
                            className="nav-text">新闻首页</span></Link>
                    </Menu.Item>
                    {(BANNER_EDIT) &&
                    <SubMenu
                        key='/app/info'
                        title={<span><Icon type="copy"/><span className="nav-text">内容管理</span></span>}>

                        {BANNER_EDIT && <Menu.Item key={CTYPE.link.news.key}>
                            <Link to={CTYPE.link.news.path}>{CTYPE.link.news.txt}</Link>
                        </Menu.Item>}

                        {BANNER_EDIT && <Menu.Item key={CTYPE.link.user.key}>
                            <Link to={CTYPE.link.user.path}>{CTYPE.link.user.txt}</Link>
                        </Menu.Item>}

                        {BANNER_EDIT && <Menu.Item key={CTYPE.link.info_banners.key}><Link
                            to={CTYPE.link.info_banners.path}>{CTYPE.link.info_banners.txt}</Link></Menu.Item>}

                        {ARTICLE_EDIT && <Menu.Item key={CTYPE.link.info_articles.key}><Link
                            to={CTYPE.link.info_articles.path}>{CTYPE.link.info_articles.txt}</Link></Menu.Item>}

                        {CUSTCASE_EDIT && <Menu.Item key={CTYPE.link.info_custcases.key}><Link
                            to={CTYPE.link.info_custcases.path}>{CTYPE.link.info_custcases.txt}</Link></Menu.Item>}

                        {CUSTEVAL_EDIT && <Menu.Item key={CTYPE.link.info_custevals.key}><Link
                            to={CTYPE.link.info_custevals.path}>{CTYPE.link.info_custevals.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {ADMIN_LIST && <SubMenu key='/app/admin'
                                            title={<span><Icon type="usergroup-add"/><span
                                                className="nav-text">权限管理</span></span>}>

                        <Menu.Item key={CTYPE.link.admin.key}><Link
                            to={CTYPE.link.admin.path}>{CTYPE.link.admin.txt}</Link></Menu.Item>

                        {ROLE_EDIT && <Menu.Item key={CTYPE.link.admin_roles.key}><Link
                            to={CTYPE.link.admin_roles.path}>{CTYPE.link.admin_roles.txt}</Link></Menu.Item>}


                    </SubMenu>}
                </Menu>
                <style>
                    {`#nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }`}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;
