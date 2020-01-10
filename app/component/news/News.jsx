import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Input, Menu, message, Modal, Row, Select, Table,} from 'antd';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import Utils from "../../common/Utils";
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Link} from "react-router-dom";

const InputSearch = Input.Search;
const Option = Select.Option;

export default class News extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            selectedRowKeys: [],
            key: 'title',
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
            collapsed: false,
        }
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({collapsed});
    };

    componentDidMount() {
        this.loadData();
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowKeys})
        },
    };

    getQuery = () => {
        let {search, q, key, status} = this.state;
        let query = {};
        if (search === true) {
            if (U.str.isNotEmpty(q)) {
                if (key === 'title') {
                    query = {title: q};
                }
            }
        }
        if (status !== 0) {
            query.status = status;
        }
        return query;
    };

    loadData = () => {

        let {pagination = {}} = this.state;

        App.api('news/findall', {
            newsQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    edit = news => {
        App.go(`/app/info/edit/news-edit/${news.id}`)
    };

    remove = (id) => {
        Modal.confirm({
            title: `确认删除该新闻?`,
            onOk: () => {
                if (Array.isArray(id)) {
                    for (let i = 0; i < id.length; i++) {
                        App.api('adm/news/deletebyid', {id: id[i]}).then(() => {
                            if (i === id.length - 1) {
                                message.success('删除成功');
                                this.loadData();
                            }
                        })
                    }
                } else {
                    App.api('adm/news/deletebyid', {id}).then(() => {

                        message.success('删除成功');
                        this.loadData();

                    })
                }
            },
            onCancel() {
            },
        });
    };

    clear = (id, index) => {
        Modal.confirm({
            title: `确认清空所有?`,
            onOk: () => {
                App.api('adm/news/deleteall', {id}).then(() => {
                    message.success('清空成功');
                    this.loadData();
                    let {list = []} = this.state;
                    this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    doExport = () => {
        Utils.exportExcel.doExport('trainees', this.getQuery());
    };

    render() {

        let {list = [], pagination = {}, q, selectedRowKeys} = this.state;

        return <div>

            <BreadcrumbCustom first={<Link to={CTYPE.link.news.path}>{CTYPE.link.news.txt}</Link>}/>

            <Card>

                <Row>

                    <Col span={12}>
                        <Button style={{margin: 10}} type="primary" icon="user-add" onClick={() => {
                            this.edit({id: 0})
                        }}>添加</Button>

                        <Button style={{margin: 10}} type="primary" icon="delete" onClick={() => {
                            this.remove(selectedRowKeys)
                        }}>删除</Button>

                        <Button style={{margin: 10}} type="primary" icon="delete" onClick={() => {
                            this.clear({id: 3})
                        }}>清空</Button>
                    </Col>

                    <Col span={12} style={{textAlign: 'right'}}>

                        <Select onSelect={(status) => {
                            this.setState({status, search: true}, () => {
                                this.loadData()
                            });
                        }} defaultValue={0} style={{width: 100}}>
                            <Option value={0}>全部状态</Option>
                            <Option value={1}>已发布</Option>
                            <Option value={2}>未发布</Option>
                        </Select>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <InputSearch
                            placeholder="输入新闻标题查询"
                            style={{width: 200}}
                            value={q}
                            onChange={(e) => {
                                this.setState({q: e.target.value});
                            }}
                            onSearch={(v) => {
                                this.setState({
                                    q: v, search: true, pagination: {
                                        ...pagination,
                                        current: 1
                                    }
                                }, () => {
                                    this.loadData()
                                });
                            }}/>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                    </Col>
                </Row>

                <Table

                    rowSelection={this.rowSelection}

                    columns={[
                        {
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            render: (col, row, i) => {
                                return <span>{(pagination.current - 1) * pagination.pageSize + (i + 1)}</span>
                            },
                        },
                        {
                            title: '标题',
                            dataIndex: 'title',
                            className: 'txt-center'
                        },
                        {
                            title: '点击量',
                            dataIndex: 'clickNum',
                            className: 'txt-center'
                        },
                        {
                            title: '创建日期',
                            dataIndex: 'createdAt',
                            className: 'txt-center',
                            render: (createdAt) => {
                                return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                            }
                        },
                        {
                            title: '状态',
                            dataIndex: 'status',
                            className: 'txt-center',
                            render: (status) => {
                                return <div className="state">
                                    {status === 1 ? <span>已发布</span> :
                                        <span className="warning">未发布</span>}</div>
                            }
                        },
                        {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, news) => {
                                let {id} = news;

                                return <Dropdown overlay={<Menu>

                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(news)}>编辑<Icon type="edit"
                                                                                   theme="twoTone"/></a>
                                    </Menu.Item>

                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(id)}>删除<Icon type="delete"
                                                                                   theme="twoTone"/></a>
                                    </Menu.Item>

                                </Menu>} trigger={['click']}>

                                    <a className="ant-dropdown-link">
                                        选项 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }
                    ]}

                    rowKey={(item) => item.id}

                    dataSource={list}

                    pagination={{...pagination, ...CTYPE.commonPagination}}

                    onChange={this.handleTableChange}/>
            </Card>
        </div>
    }
}