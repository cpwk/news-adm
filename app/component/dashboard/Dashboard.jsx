import React from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import '../../assets/css/home/home.less'
import {message} from 'antd';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        message.info("页面待完善，敬请期待！")
    }

    render() {

        return (

            <div className="gutter-example button-demo">
                <BreadcrumbCustom/>
                <div className='home-page'>
                </div>

            </div>
        )
    }
}

export default Dashboard;
