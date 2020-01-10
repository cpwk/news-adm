import React from 'react'

import {App, U, Utils} from '../../common'
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table, Tag} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'
import ArticleUtils from "../article/ArticleUtils";

export default class Custcases extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],

            pagination: {pageSize: CTYPE.pagination.pageSize, current: ArticleUtils.getCurrentPage(), total: 0},
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {

        this.setState({loading: true});

        let {pagination = {}} = this.state;

        App.api('adm/custcase/custcases', {
            custcaseQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content,
                pagination,
                loading: false
            });
            ArticleUtils.setCurrentPage(pagination.current);
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('adm/custcase/remove', {id}).then(() => {
                    message.success('删除成功');
                    let list = _this.state.list;
                    _this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    edit = (id) => {
        App.go(`/app/info/custcase-edit/${id}`);
    };

    render() {

        let {list = [], pagination = {}, loading} = this.state;

        let imgs = [];
        list.map((item) => {
            imgs.push(item.img);
        });

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.info_custcases.txt}/>

            <Card bordered={false}>

                <div style={{marginBottom: 15}}>
                    <Button type="primary" icon="file-add" onClick={() => {
                        this.edit(0)
                    }}>新建</Button>
                </div>

                <Table columns={[{
                    title: '权重',
                    dataIndex: 'priority',
                    className: 'txt-center',
                    width: '120px'
                }, {
                    title: '封面图',
                    dataIndex: 'img',
                    className: 'txt-center',
                    width: '80px',
                    render: (img, item, index) => {
                        return <img key={img} className='custcase-img' src={img + '@!120-120'} onClick={() => {
                            Utils.common.showImgLightbox(imgs, index);
                        }}/>
                    }
                }, {
                    title: '标题',
                    dataIndex: 'title',
                    className: 'txt-center',
                    render: (title, item) => {
                        let {settop} = item;
                        return <div>{settop === 1 && <Tag color="#2db7f5">置顶</Tag>}{title}</div>
                    }
                }, {
                    title: '发布时间',
                    dataIndex: 'createdAt',
                    className: 'txt-center',
                    width: '160px',
                    render: (createdAt) => {
                        return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                    }
                }, {
                    title: '上架',
                    dataIndex: 'status',
                    className: 'txt-center',
                    width: '100px',
                    render: (status) => {
                        return <div className="state">
                            {status === 1 ? <span className="important">上架</span> :
                                <span className="disabled">下架</span>}
                        </div>
                    }
                }, {
                    title: '操作',
                    dataIndex: 'opt',
                    className: 'txt-center',
                    width: '80px',
                    render: (obj, custcase, index) => {

                        return <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                                <a onClick={() => this.edit(custcase.id)}>编辑</a>
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="2">
                                <a onClick={() => this.remove(custcase.id, index)}>删除</a>
                            </Menu.Item>
                        </Menu>} trigger={['click']}>
                            <a className="ant-dropdown-link">操作 <Icon type="down"/>
                            </a>
                        </Dropdown>
                    }
                }]} rowKey={(record) => record.id} dataSource={list}
                       pagination={{...pagination, ...CTYPE.commonPagination}}
                       loading={loading}
                       onChange={this.handleTableChange}/>
            </Card>

        </div>
    }
}