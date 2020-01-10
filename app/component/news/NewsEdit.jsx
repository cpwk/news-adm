import React from 'react'
import App from '../../common/App.jsx'
import {Button, Card, Form, Input, message, Radio} from 'antd';
import {CTYPE, U} from "../../common";
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import '../../assets/css/common/common-edit.less'
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class NewsEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            news: {},
        };
    }

    componentDidMount() {
        let {id} = this.state;
        if (id > 0) {
            App.api('news/findbyid', {id}).then((news) => {
                this.setState({news});
                this.setForm(news);
            })
        } else {
            this.setForm({status: 1});
        }
    }

    setForm = (news) => {
        let {title, content, status, clickNum} = news;
        this.props.form.setFieldsValue({
            title,
            content,
            status,
            clickNum
        });
    };

    submit = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {

                let {news = {}} = this.state;

                let {title, content, status, clickNum} = values;

                if (U.str.isEmpty(title)) {
                    message.warn('请输入标题');
                    return;
                }
                if (U.str.isEmpty(content)) {
                    message.warn('请输入内容');
                    return;
                }

                App.api('news/save', {
                    news: JSON.stringify({
                        ...news,
                        title,
                        content,
                        clickNum,
                        status
                    })
                }).then(() => {
                    message.success('保存成功');
                    window.history.back();
                })
            }
        })
    };

    render() {

        const {getFieldDecorator} = this.props.form;
        return <div className="common-edit-page">
            <Card title={
                <BreadcrumbCustom first={<Link to={CTYPE.link.news.path}>{CTYPE.link.news.txt}</Link>} second='编辑新闻'/>
            }
                  extra={<Button type="primary" onClick={() => {
                      this.submit()
                  }} htmlType="submit">提交</Button>} style={CTYPE.formStyle}>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="标题">
                    {getFieldDecorator('title', {
                        rules: [{required: true, message: '请输入标题'}],
                    })(
                        <Input placeholder="标题"/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="内容">
                    {getFieldDecorator('content', {
                        rules: [{required: true, message: '请输入内容'}]
                    })(
                        <Input.TextArea rows={10} placeholder="内容"/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="发布">
                    {getFieldDecorator('status')(<RadioGroup>
                        <Radio value={1}>立即发布</Radio>
                        <Radio value={2}>暂不发布</Radio>
                    </RadioGroup>)}
                </FormItem>

            </Card>
        </div>
    }
}

export default Form.create()(NewsEdit);