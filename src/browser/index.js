import ReactDOM from 'react-dom';
import React from 'react';
import * as App from './containers/App';
import EditorModel from './model/editor';

export const Editor = EditorModel;

export const store = App.store;

export function render(mountNode, props = {}, callback = () => true) {
    return ReactDOM.render(React.createElement(App.Root, props), mountNode, callback);
}
