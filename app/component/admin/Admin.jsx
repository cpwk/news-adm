import React from 'react';
import {Table, Card, Menu, Dropdown, Icon, Modal, message, Button, Tag} from 'antd';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U, Utils} from "../../common";
import AdminUtils from "./AdminUtils";

export default class Admins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            list: [],
            loading: false
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
        Utils.nProgress.start();
        App.api('/admin/find_alladmin').then((admins) => {
            this.setState({
                list: admins,
                loading: false
            });
            Utils.nProgress.done();
        });
    };

    edit = admin => {
        App.go(`/app/admin/admin-edit/${admin.id}`);
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('/admin/remove_admin', {id}).then(() => {
                    message.success('删除成功');
                    let list = this.state.list;
                    this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    render() {

        let {list = [], loading} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.admin.txt}/>

            <Card>

                <div style={{marginBottom: '10px', height: '30px'}}>
                    <Button type="primary" icon="user-add" onClick={() => {
                        this.edit({id: 0})
                    }}>管理员</Button>
                </div>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '用户名',
                        dataIndex: 'username',
                        className: 'txt-center'
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '管理组',
                        dataIndex: 'role.name',
                        className: 'txt-center',
                        render: (str) => <Tag color='blue'>{str}</Tag>
                    },
                        {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, admin, index) => {
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(admin)}>编辑<Icon type="edit" theme="twoTone"/></a>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(admin.id, index)}>删除<Icon type="delete"
                                                                                                theme="twoTone"/></a>
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="3">
                                        <a onClick={() => AdminUtils.adminSessions(admin.id)}>登录日志<Icon type="file-text"
                                                                                                        theme="twoTone"/></a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">
                                        操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }

                        }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={false}
                    loading={loading}/>
            </Card>
        </div>
    }
}
