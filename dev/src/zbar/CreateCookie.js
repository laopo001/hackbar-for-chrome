import React from 'react';
import ReactDOM from 'react-dom'
import { Col, Row, Modal, Input, Select, message, Button, notification, Popover, Tooltip, Form,Switch } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

var CreateCookie = React.createClass({

    getInitialState() {
        return {};
    },
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            // console.log(this.props)
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            values.expirationDate=parseInt(values.expirationDate)
            chrome.runtime.sendMessage({ type: "cookies_set", data: values }, (response) => {
                 message.success(response.message)
                 this.props.end();
                 this.props.onCancel();
            });
        });

    },
    checkMD5(rule, value, callback) {

        //   console.log(value)
        if (value === "" || value == null) {
            callback();
        } else {
            if (/^[0-9a-zA-Z]{32}$/.test(value)) {
                callback();
            } else {
                callback("md5是32位数字,大小写字母");
            }
        }


    },
    render() {
        const { getFieldDecorator, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        var obj=this.props.init;
        return (
            <Modal title={this.props.title} visible={this.props.visible} width="1000" onCancel={this.props.onCancel} footer={[]}>
                <Form horizontal onSubmit={this.handleSubmit}>
                <Row>
                    <Col span="12">
                    <FormItem
                        {...formItemLayout}
                        label="url"
                        hasFeedback
                        >
                        {getFieldDecorator('url', {
                            rules: [
                                { required: true, whitespace: true, message: '请填写url' },
                            ],
                            initialValue:obj.url
                        })(<Input placeholder="请填写url " />)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="name"
                        hasFeedback
                        >
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, whitespace: true, message: '请填写name码' },
                            ],
                            initialValue:obj.name
                        })(<Input placeholder="请填写name" />)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="value"
                        hasFeedback
                        >
                        {getFieldDecorator('value', {
                            rules: [
                                { required: true, whitespace: true, message: '请填写value' },
                            ],
                            initialValue:obj.value
                        })(<Input placeholder="请填写value" />)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="domain"
                        hasFeedback
                        >
                        {getFieldDecorator('domain', {
                            rules: [
                                { required: false, whitespace: true, message: '请填写domain' },
                            ],
                            initialValue:obj.domain
                        })(<Input placeholder="如果未指定，则该cookie是host-only cookie。" />)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="path"
                        hasFeedback
                        >
                        {getFieldDecorator('path', {
                            rules: [
                                { required: false, whitespace: true, message: '请填写path' },
                            ],
                            initialValue:obj.path
                        })(<Input placeholder="默认是url参数的路径部分。" />)}
                    </FormItem>
                    </Col>
                    <Col span="12">

                    <FormItem
                        {...formItemLayout}
                        label="secure"
                        hasFeedback
                        >
                        {getFieldDecorator('secure', { valuePropName: 'checked',initialValue:  obj.secure?true:false })(
                            <Switch />
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="httpOnly"
                        hasFeedback
                        >
                        {getFieldDecorator('httpOnly', { valuePropName: 'checked' ,initialValue: obj.httpOnly?true:false})(
                            <Switch />
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="expirationDate"
                        hasFeedback
                        >
                        {getFieldDecorator('expirationDate', {
                            rules: [
                                { required: false, whitespace: true, message: '请填写expirationDate' },
                            ],
                            initialValue:obj.expirationDate==null?"":obj.expirationDate.toString()
                        })(<Input placeholder="cookie的过期时间，用从UNIX epoch开始计的秒数表示。" />)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="storeId"
                        hasFeedback
                        >
                        {getFieldDecorator('storeId', {
                            rules: [
                                { required: false, whitespace: true, message: '请填写storeId' },
                            ],
                            initialValue:obj.storeId
                        })(<Input placeholder="用于保存该cookie的存储id。" />)}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 12, offset: 7 }}>
                        <Button type="primary" onClick={this.handleSubmit} htmlType="submit">提交</Button>
                    </FormItem>
                     </Col>
                      </Row>


                </Form>

            </Modal>
        );
    }
});

CreateCookie = createForm()(CreateCookie);

export default CreateCookie