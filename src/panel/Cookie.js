import React from 'react';
import ReactDOM from 'react-dom'
import { Button, Row, Col, Select, Icon, Input, Cascader, Checkbox, message, Table, Form, Popover } from 'antd';
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const Search = Input.Search;

import Encrypt from './zbar/Encrypt'
import CreateCookie from './zbar/CreateCookie'

function Trylog(target, name, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function () {
        console.log(`"Call ${name}" arguments`, arguments);
        try {
            return oldValue.apply(target, arguments);
        } catch (e) {
            alert(e)
        }
    };
    return descriptor;
}



var Cookie = React.createClass({
    getInitialState() {
        return {
            data: [],
            orginData: [],
            url: '',
            name: '',
            title: "",
            formVisible: false,
            init: {}
        };
    },
    //    @Trylog
    componentDidMount() {

        chrome.devtools.inspectedWindow.eval(
            "location.href",
            (result, isException) => {
                if (!isException) {
                    this.setState({ url: result }, () => {
                        this.select({
                            url: this.state.url
                        })
                    })
                } else {
                    alert('err')
                }
            }
        );

    },
    //   @Trylog
    select(details) {

        try {
            chrome.runtime.sendMessage({ type: "cookies_getAll", data: details }, (response) => {
                this.setState({ data: response.cookies, orginData: response.cookies })
            });


        } catch (e) {
            alert(e)
        }

    },
    //   @Trylog
    render: function () {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13 },
        };



        const columns = [{
            title: 'operate',
            dataIndex: 'operate',
            key: 'operate',
            render: (text, record) => {

                return <div>
                    <a href="javascript:void(0)" onClick={() => {
                        this.setState({ formVisible: true, title: "UpdateOrAdd", init: Object.assign({ url: this.state.url }, record) })
                    } } >UpdateOrAdd</a>&nbsp;&nbsp; <a href="javascript:void(0)" onClick={() => {

                        chrome.runtime.sendMessage({ type: "cookies_remove", data: { url: this.state.url, name: record.name, storeId: record.storeId } }, (response) => {
                            message.success(response.message);
                            this.select({
                                url: this.state.url
                            })
                        });
                    } } >del</a>
                </div >
            }
        }, {
            title: 'domain',
            dataIndex: 'domain',
            key: 'domain',
            render: (text) => {
                if (text.length > 40) {
                    return <Popover content={text} trigger="hover">
                        <p style={{ width: "300px" }} className="plus_omit">{text}</p>
                    </Popover>
                }
                else {
                    return text;
                }
            }
        }, {
            title: 'expirationDate',
            dataIndex: 'expirationDate',
            key: 'expirationDate',
        }, {
            title: 'hostOnly',
            dataIndex: 'hostOnly',
            key: 'hostOnly',
            render: (text) => {
                if (text) {
                    return 'true';
                } else {
                    return 'false';
                }

            }
        }, {
            title: 'httpOnly',
            dataIndex: 'httpOnly',
            key: 'httpOnly',
            render: (text) => {
                if (text) {
                    return <label style={{ color: 'red' }}>true</label>;
                } else {
                    return 'false';
                }

            }
        }, {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => {
                if (text.length > 40) {
                    return <Popover content={text} trigger="hover">
                        <p style={{ width: "300px" }} className="plus_omit">{text}</p>
                    </Popover>
                }
                else {
                    return text;
                }
            }
        }, {
            title: 'path',
            dataIndex: 'path',
            key: 'path',
        }, {
            title: 'sameSite',
            dataIndex: 'sameSite',
            key: 'sameSite',
        }, {
            title: 'secure',
            dataIndex: 'secure',
            key: 'secure',
            render: (text) => {
                if (text) {
                    return 'true';
                } else {
                    return 'false';
                }

            }
        }, {
            title: 'session',
            dataIndex: 'session',
            key: 'session',
            render: (text) => {
                if (text) {
                    return 'true';
                } else {
                    return 'false';
                }

            }
        }, {
            title: 'storeId',
            dataIndex: 'storeId',
            key: 'storeId',
        }, {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
            render: (text) => {
                if (text.length > 40) {
                    return <Popover content={text} trigger="hover">
                        <p style={{ width: "300px" }} className="plus_omit">{text}</p>
                    </Popover>
                }
                else {
                    return text;
                }
            }
        }];

        return (

            <div>
                <Row>
                    <Col span="1">
                        <Button onClick={() => {
                            this.setState({ formVisible: true, title: "AddCookie", init: {} })
                        } }>add</Button>
                    </Col>
                    <Col span="11">
                        <FormItem
                            {...formItemLayout}
                            label="url:"
                            hasFeedback
                            >
                            <Input value={this.state.url} onChange={(event) => {
                                this.setState({ url: event.target.value }, () => {
                                    this.select({
                                        url: this.state.url
                                    })
                                })

                            } } placeholder="url" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem
                            {...formItemLayout}
                            label="name:"
                            hasFeedback
                            >
                            <Input value={this.state.name} onChange={(event) => {
                                this.setState({
                                    name: event.target.value,
                                    data: this.state.orginData.filter((x) => {
                                        if (x.name.match(event.target.value)) {
                                            return true;
                                        } else { return false; }
                                    })
                                })

                            } } placeholder="name" />
                        </FormItem>
                    </Col>
                </Row>

                <CreateCookie visible={this.state.formVisible} init={this.state.init} onCancel={() => {
                    this.setState({ formVisible: false })
                } } title={this.state.title} end={() => {
                    this.select({
                        url: this.state.url
                    })
                } } />
                <Table rowKey={(record, index) => { index } } size="small" dataSource={this.state.data} columns={columns} />
            </div >
        );
    }
});

export default Cookie;