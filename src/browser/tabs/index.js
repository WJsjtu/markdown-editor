import React, {Component} from 'react';
import ReactDOM from "react-dom";
import TabBar from "./tabBar/index";

module.exports = {
    getTabBar: (mountNode, props = {}) => {
        ReactDOM.render(React.createElement(TabBar, props), mountNode);
    }
};