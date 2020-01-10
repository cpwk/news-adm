let CTYPE = (() => {

    let maxlength = {title: 140, intro: 500};

    let minlength = {title: 1, intro: 1};

    return {

        maxlength: maxlength,

        minlength: minlength,

        pagination: {pageSize: 10},

        fieldDecorator_rule_title: {
            type: 'string',
            required: true,
            message: `标题长度为${minlength.title}~${maxlength.title}个字`,
            whitespace: true,
            min: minlength.title,
            max: maxlength.title
        },

        link: {
            news: {key: '/app/info/news', path: '/app/info/news', txt: '新闻管理'},
            user: {key: '/app/info/user', path: '/app/info/user', txt: '用户管理'},
            info_banners: {key: '/app/info/banners', path: '/app/info/banners', txt: 'Banner'},
            info_articles: {key: '/app/info/articles', path: '/app/info/articles', txt: '动态管理'},
            info_custcases: {key: '/app/info/custcases', path: '/app/info/custcases', txt: '案例管理'},
            info_custevals: {key: '/app/info/custevals', path: '/app/info/custevals', txt: '评价管理'},


            admin: {key: '/app/admin/admins', path: '/app/admin/admins', txt: '管理员'},
            admin_roles: {key: '/app/admin/roles', path: '/app/admin/roles', txt: '权限组'},
        },

        //图片裁切工具比例
        imgeditorscale: {
            square: 1,
            rectangle_v: 1.7778,
            rectangle_h: 0.5625,
        },

        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        dialogItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        shortFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 4},
                sm: {span: 3},
            },
        },
        longFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        tailFormItemLayout: {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 3,
                },
            },
        },
        bannerTypes: [{type: 1, label: 'PC首页'}, {type: 2, label: '移动端首页'}]

    }
})();

export default CTYPE;