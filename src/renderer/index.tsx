import * as React from 'react';
import * as ReactDOM from 'react-dom';

import FileModel from './models/FileModel';
import fileStore from './stores/FileStore';
import TabView from './containers/TabView';
import EditorView from './containers/EditorView';

export default class App {
    public readonly store: FileModel = fileStore;

    constructor() {
        this.createTabView = this.createTabView.bind(this);
        this.createEditorView = this.createEditorView.bind(this);
    }

    public createTabView(container: HTMLElement): any {
        return ReactDOM.render(<TabView fileModel={this.store}/>, container);
    }

    public createEditorView(container: HTMLElement): any {
        return ReactDOM.render(<EditorView fileModel={this.store}/>, container);
    }
}