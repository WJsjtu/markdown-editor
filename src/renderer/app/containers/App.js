import React, {Component, createElement} from 'react';
import {Provider} from 'react-redux';
import DocTabBar from './DocTabBar';
import configureStore from './../store/configureStore';

export const store = configureStore();

export class Root extends Component {
    render() {

        return (
            <Provider store={store}>
                <DocTabBar {...this.props}/>
            </Provider>
        );
    }
}