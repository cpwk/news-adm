import React, {Component} from 'react';
import {Layout, message, Spin} from 'antd';
import './style/index.less';
import SiderCustom from './common/SiderCustom';
import HeaderCustom from './common/HeaderCustom';
import './assets/css/common.less'

import {App, Utils} from './common'

const {Content, Footer} = Layout;

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            permissionsLoaded: false
        };
    }

    componentDidMount() {
        if (window.location.hash.indexOf('signin') < 0) {
            let adm = App.adminProfile();
            if (!adm.id) {
                App.logout();
                App.go('/signin');
            } else {
                this.loadPermissions(0);
            }
        }

    }

    loadPermissions = (count) => {

        let timer = null;
        if (!Utils.adminPermissions) {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                this.loadPermissions(count + 1);
            }, 500);

            if (count > 3) {
                clearTimeout(timer);
                App.logout();
                App.go('/signin');
            }
            Utils.adm.initPermissions();
        } else {
            this.setState({
                permissionsLoaded: true
            });
            message.destroy();
        }
    };


    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        let {permissionsLoaded, collapsed} = this.state;
        if (permissionsLoaded) {
            return <Layout className="ant-layout-has-sider">
                <SiderCustom collapsed={collapsed}/>
                <Layout>

                    <HeaderCustom toggle={this.toggle}/>

                    <Content style={{margin: '0 16px', overflow: 'initial'}}>
                        {this.props.children}
                    </Content>

                    <Footer style={{textAlign: 'center'}}>
                        迈道教育 @2019 Created by 陈鹏
                    </Footer>

                </Layout>
            </Layout>
        } else {
            return <Spin spinning={true}/>
        }
    }
}
