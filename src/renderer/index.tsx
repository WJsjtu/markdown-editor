import * as React from 'react';
import * as ReactDOM from 'react-dom';

import FileModel from './models/FileModel';
import fileStore from './stores/FileStore';
import EditorView from './containers/EditorView';

export default class App {

    public readonly store: FileModel = fileStore;
    protected editorInstance: any;

    get instance(): any {
        return this.editorInstance;
    }

    constructor(container: HTMLElement) {
        this.editorInstance = ReactDOM.render(<EditorView fileModel={this.store}/>, container);
    }
}