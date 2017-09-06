import React from 'react';
import ReactDOM from 'react-dom'
import { Button, Row, Col, Select, Icon, Input, Cascader, Checkbox, message, Table, Form,Popover } from 'antd';
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const Search = Input.Search;

import Encrypt from './zbar/Encrypt'




var JSONP = React.createClass({
    getInitialState() {
        return {
            data: [],
            Reg: '^[^\\(\\)]+\\([^\\(\\)]+\\);?$'
        };
    },

    componentDidMount() {
        chrome.devtools.network.onRequestFinished.addListener((request) => {
            // var div = document.createElement("div");
            // var text = document.createTextNode(JSON.stringify(request));
            // div.appendChild(text);
            // document.body.appendChild(div);
            //  if (request.request.method == 'GET'&&request.response.content.mimeType.match("text/html")) {


            request.getContent((content, encoding) => {
                // if(content.match(/^\s*<|^{/)){return;}

                if (new RegExp(this.state.Reg).test(content)) {
                    //     alert(content)
                    var obj = {
                        url: request.request.url,
                        content: content
                    }
                    //  alert(this.state.data)
                    this.state.data.push(obj)
                    this.setState({
                        data: this.state.data
                    });

                }




            })

            // }

        });
    },
    render: function () {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13 },
        };



        const columns = [{
            title: 'url',
            dataIndex: 'url',
            key: 'url',
            render: (text) => {
                try {
                    if (text.length > 100) {
                        // return <Tooltip placement="bottom" title={text}>
                        //     <p style={{ width: "500px" }} className="plus_omit">{text}</p>
                        // </Tooltip>;
                        return <Popover content={text} trigger="hover">
                            <p style={{ width: "850px" }} className="plus_omit">{text}</p>
                        </Popover>
                    }
                    else {
                        return text;
                    }
                }
                catch (e) {
                    return "";
                }

            }
        }, {
            title: 'content',
            dataIndex: 'content',
            key: 'content',
            render: (text) => {
                try {
                    if (text.length > 100) {
                        // return <Tooltip placement="bottom" title={text}>
                        //     <p style={{ width: "500px" }} className="plus_omit">{text}</p>
                        // </Tooltip>;
                        return <Popover content={text} trigger="hover">
                            <p style={{ width: "850px" }} className="plus_omit">{text}</p>
                        </Popover>
                    }
                    else {
                        return text;
                    }
                }
                catch (e) {
                    return "";
                }

            }
        }];
        return (
            <div>
                <FormItem
                    {...formItemLayout}
                    label="过滤:"
                    hasFeedback
                    >
                    <Input value={this.state.Reg} onChange={(event) => { this.setState({ Reg: event.target.value }) } } placeholder="过滤正则" style={{ width: '90%', marginRight: 8 }} /> <Icon type="delete" onClick={() => {
                        this.setState({ data: [] })
                    } } />
                </FormItem>

                <Table size="small" dataSource={this.state.data} columns={columns} />
            </div >
        );
    }
});

export default JSONP;