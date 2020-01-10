import React from 'react'
import {App, CTYPE, OSSWrap, U} from '../../common'
import {Button, Card, Form, Input, InputNumber, message, Radio} from 'antd';
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../../common/BreadcrumbCustom'
import '../../assets/css/common/common-edit.less'
import {PosterEdit} from "../../common/CommonEdit";
import HtmlEditor from "../../common/HtmlEditor";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class CustcaseEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            custcase: {}

        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let id = this.state.id;
        if (id && id > 0) {
            App.api('adm/custcase/custcase', {id}).then((custcase) => {
                this.setState({
                    custcase
                });
                this.setForm(custcase);
            })
        } else {
            this.setForm({});
        }
    };

    setForm = (custcase) => {
        let {title, subtitle, context, customer, industry, service, priority, status = 1} = custcase;
        this.props.form.setFieldsValue({
            title, subtitle, context, customer, industry, service, priority, status
        });
    };

    syncContent = (content) => {
        this.setState({
            custcase: {
                ...this.state.custcase,
                content
            }
        })
    };

    syncPoster = (img) => {
        this.setState({
            custcase: {
                ...this.state.custcase,
                img
            }
        });
    };

    handleNewImage = (type, e) => {

        let {uploading, custcase = {}} = this.state;

        let {banners = []} = custcase;

        let img = e.target.files[0];

        if (!img || img.type.indexOf('image') < 0) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }

        if (uploading) {
            message.loading('上传中');
            return;
        }
        this.setState({uploading: true});
        OSSWrap.upload(img).then((result) => {

            if (type === 'img') {
                custcase.img = result.url;
            } else if (type === 'topImg') {
                custcase.topImg = result.url;
            } else {
                banners.push({img: result.url});
                custcase.banners = banners;
            }

            this.setState({
                custcase, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, custcase) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            }
            if (!err) {
                let id = this.state.id;
                custcase.id = id > 0 ? id : null;

                let _custcase = this.state.custcase;

                let {img, banners = [], settop, topIntro, topImg} = _custcase;


                if (U.str.isEmpty(img)) {
                    message.warn('请上传图片');
                    return;
                }

                {
                    custcase.img = img;
                    custcase.banners = banners;
                    custcase.content = _custcase.content;
                    custcase.createdAt = _custcase.createdAt;
                    custcase.settop = settop || 2;
                    custcase.topIntro = topIntro;
                    custcase.topImg = topImg;
                    custcase.priority = custcase.priority || 0;
                }

                App.api('adm/custcase/save', {custcase: JSON.stringify(custcase)}).then(() => {
                    message.success('保存成功');
                    setTimeout(() => {
                        window.history.back();
                    }, 500);
                });

            }
        });
    };

    render() {

        let {id, custcase = {}} = this.state;

        const {getFieldDecorator} = this.props.form;

        let {img, banners = [], content, settop = 2, topIntro, topImg} = custcase;

        let style_img = {width: '300px', height: '300px'};
        let style = {width: '480px', height: '132px'};
        let style_topImg = {width: '335px', height: '145px'};

        return <div className="common-edit-page">

            <Form onSubmit={this.handleSubmit}>
                <Card title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.info_custcases.path}>{CTYPE.link.info_custcases.txt}</Link>}
                    second={id > 0 ? '编辑案例' : '新建案例'}/>} bordered={false}
                      extra={<Button type="primary" htmlType="submit">{id > 0 ? '保存' : '发布'}</Button>}
                      style={CTYPE.formStyle}>


                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='标题'
                        hasFeedback>
                        {getFieldDecorator('title', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <Input placeholder={`建议输入字数不超过${CTYPE.maxlength.title}个字`}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='副标题'
                        hasFeedback>
                        {getFieldDecorator('subtitle', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <Input placeholder={`建议输入字数不超过${CTYPE.maxlength.title}个字`}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='项目背景'
                        hasFeedback>
                        {getFieldDecorator('context', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <Input placeholder={`建议输入字数不超过${CTYPE.maxlength.title}个字`}/>
                        )}
                    </FormItem>

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
                        label='行业'
                        hasFeedback>
                        {getFieldDecorator('industry', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <Input placeholder={`建议输入字数不超过${CTYPE.maxlength.title}个字`}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='服务'
                        hasFeedback>
                        {getFieldDecorator('service', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <Input placeholder={`建议输入字数不超过${CTYPE.maxlength.title}个字`}/>
                        )}
                    </FormItem>

                    {false &&
                    <PosterEdit title='列表封面' type='s' img={img} required={true} syncPoster={this.syncPoster}/>}

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label={<span className='required'>列表封面</span>}>
                        <div className='common-edit-page'>
                            <div className='upload-img-preview' style={style_img}>
                                {img && <img src={img} style={style_img}/>}
                            </div>
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file'
                                           onChange={(e) => this.handleNewImage('img', e)}/>
                                    选择图片</Button>
                                <br/>
                                建议上传图片尺寸<span>600*600</span>，.jpg、.png格式，文件小于1M
                            </div>
                        </div>
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="顶部banner">

                        <div className='common-edit-page'>
                            {banners.map((banner, i) => {
                                let {img} = banner;
                                return <div key={i}>
                                    <div className='upload-img-preview' style={style}>
                                        <img src={img} style={style}/>
                                        <Button className='icon-remove' type='danger' size='small' shape="circle"
                                                icon="close"
                                                onClick={() => {
                                                    custcase.banners = U.array.remove(banners, i);
                                                    this.setState({
                                                        custcase
                                                    });
                                                }}/>
                                    </div>
                                </div>
                            })}
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file'
                                           onChange={(e) => this.handleNewImage('banner', e)}/>
                                    选择图片</Button>
                                <br/>
                                建议上传图片尺寸<span>1920*530</span>，.jpg、.png格式，文件小于1M
                            </div>
                        </div>

                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='权重'
                        hasFeedback>
                        {getFieldDecorator('priority')(
                            <InputNumber/>
                        )}
                    </FormItem>

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

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='置顶'>
                        <RadioGroup value={settop} onChange={(e) => {
                            this.setState({
                                custcase: {
                                    ...custcase,
                                    settop: e.target.value
                                }
                            })
                        }}>
                            <Radio value={1}>是</Radio>
                            <Radio value={2}>否</Radio>
                        </RadioGroup>
                    </FormItem>

                    {settop === 1 && <div>
                        <FormItem
                            {...CTYPE.formItemLayout}
                            label="列表简介">
                            <Input.TextArea rows={3} value={topIntro} onChange={(e) => {
                                this.setState({
                                    custcase: {
                                        ...custcase,
                                        topIntro: e.target.value
                                    }
                                })
                            }}/>
                        </FormItem>

                        <FormItem
                            {...CTYPE.formItemLayout}
                            label="列表封面"
                            hasFeedback>
                            <div className='common-edit-page'>
                                <div className='upload-img-preview' style={style_topImg}>
                                    {topImg && <img src={topImg} style={style_topImg}/>}
                                </div>
                                <div className='upload-img-tip'>
                                    <Button type="primary" icon="file-jpg">
                                        <input className="file" type='file'
                                               onChange={(e) => this.handleNewImage('topImg', e)}/>
                                        选择图片</Button>
                                    <br/>
                                    建议上传图片尺寸<span>670*290</span>，.jpg、.png格式，文件小于1M
                                </div>
                            </div>
                        </FormItem>

                    </div>}

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="内容">
                        <HtmlEditor content={content} syncContent={this.syncContent}/>
                    </FormItem>

                </Card>
            </Form>
        </div>
    }
}

const CustcaseEdit = Form.create()(CustcaseEditForm);

export default CustcaseEdit;