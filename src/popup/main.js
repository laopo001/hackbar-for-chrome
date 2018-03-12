import React from 'react';
import ReactDOM from 'react-dom'
import { Button, Row, Col, Select, Icon, Input, Cascader, Checkbox, message, Tabs, Form, Tree } from 'antd';
const ButtonGroup = Button.Group;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const TabPane = Tabs.TabPane;
import 'antd/dist/antd.css';



var Root = React.createClass({
    getInitialState() {
        return {
            orgbookmarks: [],
            bookmarks: [],
        };
    },

    componentDidMount() {
        var filter = function (arr, Reg) {
            return arr.map((x, index) => {
                if (x.children != null) {
                    return Object.assign({}, x, { children: filter(x.children, Reg) })
                } else {
                    if (x.title.match(Reg)) {
                        return x;
                    }
                    //return  x
                }
            });
        }


        chrome.bookmarks.getTree((array) => {
            this.setState({ orgbookmarks: array, bookmarks: array })

        })
    },

    render: function () {
        var ExpandArr = [];
        var Run = function (arr) {
            return arr.map((x, index) => {

                if (x.children != null) {
                    ExpandArr.push(x.id + '|' + x.url)
                    return <TreeNode title={x.title} key={x.id + '|' + x.url} >{Run(x.children)}</TreeNode>
                } else {
                    return <TreeNode title={x.title} key={x.id + '|' + x.url} />
                }

            });
        }
        var filter = function (arr, Reg) {
            return arr.map((x, index) => {
                if (x.children != null) {
                    return Object.assign({}, x, { children: filter(x.children, Reg) })
                } else {
                    if (x.title.toLowerCase().match(Reg)) {
                        return x;
                    }
                }
            }).filter((x) => { if (x == undefined) { return false } else { return true } });
        }



        var node = Run(this.state.bookmarks)

        var tree = <Tree showLine defaultExpandAll={true} expandedKeys={ExpandArr} onRightClick={(x) => { alert(x) }}
            onSelect={(info) => {
                if (info[0].split('|')[1] == 'undefined') {
                    return;
                } else {
                    chrome.tabs.create({ url: info[0].split('|')[1] }, () => { })
                }
            }}
        >

            {node}
        </Tree>
        return (
            <div style={{ padding: '0 20px', width: '500px', height: '80%' }}>
                <Input placeholder="search" onChange={(e) => {
                    try {
                        var temp = filter(this.state.orgbookmarks, e.target.value)
                        this.setState({ bookmarks: temp })
                    } catch (error) {
                        alert(error)
                    }

                }} addonAfter={<Icon type="search" />} />

                {tree}
            </div>
        );
    }
});




ReactDOM.render(
    <Root />,
    document.getElementById("root")
);