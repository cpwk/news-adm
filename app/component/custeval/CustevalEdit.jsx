import React from 'react'
import {App, CTYPE, U} from '../../common'
import {Button, Card, Form, Input, message, Radio} from 'antd';
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../../common/BreadcrumbCustom'
import '../../assets/css/common/common-edit.less'
import {PosterEdit} from "../../common/CommonEdit";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class CustevalEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            custeval: {}

        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let id = this.state.id;
        if (id && id > 0) {
            App.api('adm/custeval/custeval', {id}).then((custeval) => {
                this.setState({
                    custeval
                });
                this.setForm(custeval);
            });
        } else {
            this.setForm({});
        }
    };

    setForm = (custeval) => {
        let {title, customer, status = 1} = custeval;
        this.props.form.setFieldsValue({
            title, customer, status
        });
    };

    syncPoster = (img) => {
        this.setState({
            custeval: {
                ...this.state.custeval,
                img
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, custeval) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            }
            if (!err) {
                let id = this.state.id;
                custeval.id = id > 0 ? id : null;

                let _custeval = this.state.custeval;

                if (U.str.isEmpty(_custeval.img)) {
                    message.warn('请上传图片');
                    return;
                }

                {
                    custeval.img = _custeval.img;
                    custeval.createdAt = _custeval.createdAt;
                }
                App.api('adm/custeval/save', {custeval: JSON.stringify(custeval)}).then(() => {
                    message.success('保存成功');
                    setTimeout(() => {
                        window.history.back();
                    }, 500);
                });

            }
        });
    };

    render() {

        let {id, custeval} = this.state;

        const {getFieldDecorator} = this.props.form;
        let {img} = custeval;

        return <div className="common-edit-page">

            <Form onSubmit={this.handleSubmit}>
                <Card title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.info_custevals.path}>{CTYPE.link.info_custevals.txt}</Link>}
                    second={id > 0 ? '编辑动态' : '新建动态'}/>} bordered={false}
                      extra={<Button type="primary" htmlType="submit">{id > 0 ? '保存' : '发布'}</Button>}
                      style={CTYPE.formStyle}>


                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='客户'
                        hasFeedback>
                        {getFieldDecorator('customer', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <Input placeholder={`建议输入字数不超过${CTYPE.maxlength.title}个字`}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="评价内容"
                        hasFeedback>
                        {getFieldDecorator('title', {
                            rules: [{
                                type: 'string',
                                required: true,
                                message: `简介长度为${CTYPE.minlength.intro}~${CTYPE.maxlength.intro}个字`,
                                whitespace: true,
                                min: CTYPE.minlength.intro,
                                max: CTYPE.maxlength.intro
                            }],
                        })(
                            <Input.TextArea rows={3}/>
                        )}
                    </FormItem>

                    <PosterEdit title='列表封面' type='h' img={img} required={true} syncPoster={this.syncPoster}/>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='上架'>
                        {getFieldDecorator('status')(
                            <RadioGroup>
                                <Radio value={1}>上架</Radio>
                                <Radio value={2}>下架</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                </Card>
            </Form>
        </div>
    }
}

const CustevalEdit = Form.create()(CustevalEditForm);

export default CustevalEdit;