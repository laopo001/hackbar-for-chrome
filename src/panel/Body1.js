import React from 'react';
import ReactDOM from 'react-dom'
import { Button, Row, Col, Select, Icon, Input, Cascader, Checkbox, message } from 'antd';
const ButtonGroup = Button.Group;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

import Encrypt from './zbar/Encrypt'




var BODY1 = React.createClass({
    getInitialState() {

        return {
            url: '',
            query: '',
            queryInput: false,
            currDom: 'url',
            baseOffset: 0,
            focusOffset: 0
        };
    },
    getString() {

        var currState = this.state.currDom;
        var field = document.getElementById(currState);
        var str = this.state[currState].slice(field.selectionStart, field.selectionEnd);
        if (str.length == 0) {
            message.warn("请先选择！")
            return str;
        }
        return str;

    },
    setString(str) {
        var currState = this.state.currDom;
        var field = document.getElementById(currState);
        if (currState == 'query') {
            this.setState({ 'query': this.state[currState].slice(0, field.selectionStart) + str + this.state[currState].slice(field.selectionEnd, this.state[currState].length) })
        }
        if (currState == 'url') {
            this.setState({ 'url': this.state[currState].slice(0, field.selectionStart) + str + this.state[currState].slice(field.selectionEnd, this.state[currState].length) })
        }
    },
    componentDidMount() {
        document.onkeydown = () => {
            var oEvent = window.event;
            if (oEvent.keyCode == 13 && oEvent.ctrlKey) {  //这里只能用alt，shift，ctrl等去组合其他键event.altKey、event.ctrlKey、event.shiftKey 属性

                this.ExecuteUrl();
            }
        }
        document.getElementById('tabs1').onclick = (e) => {
            setTimeout(() => {
                document.getElementById(this.state.currDom).focus();
            }, 0)

            if (e.target.id == "url") {
                this.setState({
                    currDom: 'url',
                })
            }
            if (e.target.id == "query") {
                this.setState({
                    currDom: 'query',
                })
            }

        }


    },
    ExecuteUrl() {
        var url = this.state.url

        if (url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://') {
        } else {
            url = 'http://' + url;
        }
 
        if (this.state.queryInput) {

            chrome.devtools.inspectedWindow.eval(
                `
                                (function(url,query){
                                    var form=document.createElement('form');
                                    form.method='POST';
                                    form.action=url;

                                    query.split('&').forEach((element)=>{
                                        var input=document.createElement('input');
                                        input.name=element.split('=')[0];
                                        input.value=element.split('=')[1];
                                        form.appendChild(input);
                                    });
                                    form.submit();
                                 //   document.body.appendChild(form);

                                })("${this.state.url}","${this.state.query}")
                                    `,
                (result, isException) => {
                    if (!isException) {
                        // var query=result.match(/^\?.*/)[0];
                        message.success('成功');
                    } else {
                        alert('err' + queryInput)
                    }
                }
            );
        }
        else {
            chrome.devtools.inspectedWindow.eval(
                `location.href='${url}'`,
                (result, isException) => {
                    if (!isException) {
                        // alert(result)
                    } else {
                        alert('err')
                    }
                }
            );
        }
    },

    render: function () {
        var queryInput;
        if (this.state.queryInput) {
            queryInput = <Input type="textarea" id='query' className="shu" rows={4} value={this.state.query} onChange={(event) => { this.setState({ query: event.target.value }) } } />
        } else {
            queryInput = <Input type="textarea" id='query' style={{ display: 'none' }} className="shu" rows={4} value={this.state.query} onChange={(event) => { this.setState({ query: event.target.value }) } } />;
        }
        var options = [{
            value: 'base64Encode',
            label: 'base64Encode',
            children: []
        }, {
            value: 'base64Decode',
            label: 'base64Decode',
            children: []
        }, {
            value: 'escape',
            label: 'escape',
            children: []
        }, {
            value: 'unescape',
            label: 'unescape',
            children: []
        }, {
            value: 'HEX  Encoding',
            label: 'HEX  Encoding',
            children: [{
                value: 'hexEncoding1',
                label: 'String to 00ff00ff'
            }, {
                value: 'NumberToHex',
                label: 'INT to HEX'
            }],
        }, {
            value: 'HEX  Dncoding',
            label: 'HEX  Dncoding',
            children: [{
                value: 'hexDecoding',
                label: 'HEX to Characters'
            }, {
                value: 'HexToNumber',
                label: 'HEX to INT'
            }],
        }];
        return (
            <div id="tabs1">
                <Row gutter={16}>
                    <Col span={2}>
                        {
                            // <Select defaultValue="INT" style={{ width: '100%' }} onChange={function () { } }>
                            //     <Option value="INT">INT</Option>
                            //     <Option value="HEX">HEX</Option>
                            //     <Option value="OCT">OCT</Option>
                            //     <Option value="Alphabet">Alphabet</Option>
                            //     <Option value="ALNum">ALNum</Option>
                            // </Select>
                        }
                    </Col>
                    <Col span={21}>
                        <Select value="Encryption" style={{ width: '100px' }} onSelect={(value, option) => {

                            var select = this.getString();

                            if (select.length != 0) {
                                this.setString(Encrypt[value](select))
                            }

                        } }>
                            <Option value="md5">MD5_32</Option>
                            <Option value="md5_16">MD5_16</Option>
                            <Option value="sha1">SHA1 Hash</Option>
                            <Option value="sha2">SHA1-256</Option>
                            <Option value="rot13">ROT13</Option>

                        </Select>
                       
                        <Cascader options={options} expandTrigger='hover' onChange={(value, option) => {

                            var value = value[value.length - 1]
                            var select = this.getString();
                            if (select.length != 0) {
                                this.setString(Encrypt[value](select))
                            }

                        } } placeholder="" displayRender={(label) => {
                            return 'Encoding';
                        } } />
                      
                    </Col>
                    
                </Row>
                <Row gutter={16}>
                    <Col span={2}>
                        <Button style={{ width: '100%' }} onClick={() => {

                            // alert(JSON.stringify(this.state));
                            chrome.devtools.inspectedWindow.eval(
                                "location.href",
                                (result, isException) => {
                                    if (!isException) {
                                        // var query=result.match(/^\?.*/)[0];
                                        this.setString(result)
                                        // this.setState({ url: result }, function () {
                                        //     // alert(this.state.url);
                                        // })
                                    } else {
                                        alert('err')
                                    }
                                }
                            );
                        } }>Load URL</Button>
                        {
                            <Button style={{ width: '100%' }} onClick={() => {
                                // var currState=this.state.currDom;

                                // var field = document.getElementById(currState);
                                // alert(field.selectionStart);alert(field.selectionEnd);


                                var Num = parseInt(prompt('请输入字段数'));
                                var str = 'UNION SELECT ';
                                for (var i = 1; i <= Num; i++) {
                                    str += i + ',';
                                }
                                str = str.substr(0, str.length - 1);

                                this.setString(str)
                                // var currState=this.state.currDom;
                                // var field = document.getElementById(currState);
                                // if(currState=='query'){
                                // this.setState({ 'query': this.state[currState].slice(0,field.selectionStart) + str + this.state[currState].slice(field.selectionEnd,this.state[currState].length) })
                                // }
                                // if(currState=='url'){
                                // this.setState({ 'url': this.state[currState].slice(0,field.selectionStart) + str + this.state[currState].slice(field.selectionEnd,this.state[currState].length) })
                                // }
                            } }>UNION SELECT</Button>
                        }
                        <Button style={{ width: '100%' }} onClick={this.ExecuteUrl} >Execute</Button>
                    </Col>
                    <Col span={22}>
                        <Input name='input' type="textarea" className="shu" id='url' rows={4} value={this.state.url} onChange={(event) => { this.setState({ url: event.target.value }) } } />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={2} style={{ textAlign: 'center' }}>
                        <Checkbox onChange={(e) => {
                            this.setState({ queryInput: e.target.checked });
                        } }>POST</Checkbox>
                    </Col>
                    <Col span={22}>
                        {
                            queryInput
                        }

                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24} style={{ textAlign: 'center' }}>

                    </Col>

                </Row>
            </div >
        );
    }
});

export default BODY1;