import * as tabActions from '../actions/tabActions';
import getID from '../utils/getID';
import Events from '../utils/Events';
import * as types from '../constants/actionTypes';
import {REDUX_TAB_EVENT} from '../constants/eventTypes';
import * as App from '../containers/App';

export default class Editor extends Events {

    static instances = {};

    static active = null;

    constructor(path, title, content, parentElement) {

        super();

        this.id = getID();

        this._render(parentElement);
        this._getEditor(content);

        App.store.dispatch(tabActions.openTab(this.id, path, title));

        this._registerEvent();

        Editor.instances[this.id] = this;

    }

    /**
     *
     * @param parentElement
     * @private
     */
    _render(parentElement) {
        const element = document.createElement('div');
        element.style.height = '100%';
        element.style.width = '100%';
        element.style.display = 'none';
        parentElement.appendChild(element);
        this.element = element;
    }

    /**
     *
     * @param content
     * @private
     */
    _getEditor(content) {
        this.content = content;
        this.editor = monaco.editor.create(this.element, {
            value: content,
            language: 'markdown',
            theme: 'vs-dark'
        });
    }

    /**
     *
     * @private
     */
    _registerEvent() {
        this.editor.onDidChangeModelContent(() => {

            const content = this.editor.model.getValue();

            if (App.store.getState().tabs.active === this.id) {

                this.trigger('change', content);
            }

            App.store.dispatch(tabActions.modifyTab(this.id, this.content !== content))

        });


        this.editor.onDidScrollChange((event) => {
            this.trigger('scroll', event);
        });
    }

    activate() {

        const activeEditor = Editor.instances[Editor.active];
        if (activeEditor) activeEditor.element.style.display = 'none';

        Editor.active = this.id;
        this.element.style.display = 'block';
        this.editor.layout();

        this.trigger('activate', this.editor.model.getValue());
    }

    dispose() {
        super.dispose();
        delete Editor.instances[this.id];
        this.editor.dispose();
        this.element.remove();
    }
}

window.addEventListener('resize', () => {
    const activeEditor = Editor.instances[Editor.active];
    if (activeEditor) activeEditor.editor.layout();
});

document.addEventListener(REDUX_TAB_EVENT, (e) => {

    const {action} = e.detail;

    switch (action.type) {
        case types.tabActions.CLOSE:
            !function () {
                const {id} = action.payload;
                const editor = Editor.instances[id];
                if (editor) {
                    editor.dispose();
                }
            }();
            break;
        case types.tabActions.ACTIVATE:
            !function () {
                const {id} = action.payload;
                const editor = Editor.instances[id];
                if (editor) {
                    editor.activate();
                }
            }();
            break;

        case types.tabActions.SWAP:

            !function () {
                const {fromID} = action.payload;
                const editor = Editor.instances[fromID];
                if (editor) {
                    editor.activate();
                }
            }();
            break;
        default:

    }
});