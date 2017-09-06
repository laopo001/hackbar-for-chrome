import React from 'react';
import ReactDOM from 'react-dom'
import { Button, Row, Col, Select, Icon, Input, Cascader, Checkbox, message, Tabs, Form } from 'antd';
const ButtonGroup = Button.Group;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const TabPane = Tabs.TabPane;
import 'antd/dist/antd.css';

import BODY1 from './Body1'
import JSONP from './JSONP'
import Cookie from './Cookie'


var Root = React.createClass({
    getInitialState() {
        return {};
    },

    componentDidMount() {

    },

    render: function () {
        function callback(key) {
            console.log(key);
        }
        return (
            <div style={{ padding: '0 20px' }}>
                <Tabs defaultActiveKey="1" onChange={callback} tabBarExtraContent={<Button onClick={function () { location.reload() }}><Icon type="reload" /></Button>}>
                    <TabPane tab="URL" key="1">
                        <BODY1 />
                    </TabPane>
                    <TabPane tab="filter" key="2">
                        <JSONP />
                    </TabPane>
                    <TabPane tab="cookie" key="3">
                        <Cookie />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});
ReactDOM.render(
    <Root />,
    document.getElementById("root")
);