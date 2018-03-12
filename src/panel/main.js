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


const Child = React.createClass({
    getInitialState() {
        return {
            name: this.props.name,
        };
    },
    render() {
        return <div>{
            this.props.name != null ? String(this.props.name) : String(this.state.name)
        }<button onClick={() => { console.log(this.props.name); this.setState({ name: !this.state.name }); this.props.onChange(!this.state.name) }}>cs</button></div>
    }
})

const Parent = React.createClass({
    getInitialState() {
        return {
            name: false,
        };
    },

    render() {
        return <div><Child onChange={(x) => { this.setState({ name: x }); }}></Child></div>
    }
})



var Root = React.createClass({
    getInitialState() {
        return { checked: true };
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
            </div >
        );
    }
});
ReactDOM.render(
    <Root />,
    document.getElementById("root")
);