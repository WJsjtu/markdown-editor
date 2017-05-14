import * as React from 'react';
import * as ReactDOM from 'react-dom';

import EditorModel from './models/EditorModel';
import editorStore from './stores/EditorStore';
import EditorView from './containers/EditorView';

export default class App {

    public readonly store: EditorModel = editorStore;

    constructor(container: HTMLElement) {
        ReactDOM.render(<EditorView fileModel={this.store}/>, container);
    }
}