import {observable, computed, action} from 'mobx';
import {ITabProps} from '../components/TabBar/index';
import {IEditorProps} from '../containers/EditorView';
import EventEmitter from '../utils/EventEmitter';
import IDGenerator from '../utils/IDGenerator';

export interface IFile {
    title: string,
    path: string,
    content: string
}

class FileInstance implements IFile {
    public readonly id: string;

    @observable public value?: string;

    public readonly title: string;
    public readonly path: string;
    public readonly content: string;

    constructor(file: IFile) {
        this.id = IDGenerator();
        this.title = file.title;
        this.path = file.path;
        this.content = file.content;
        this.value = file.content;
    }

    @computed get modified(): boolean {
        return this.content !== this.value;
    }
}

export default class EditorModel extends EventEmitter {

    public editor: any;

    @observable public options: any = {
        theme: 'vs-dark',
        automaticLayout: true
    };

    @observable protected files: Map<string, FileInstance> = new Map();

    protected history: Array<string> = [];

    @observable protected order: Array<string> = [];

    @observable protected activeID: string | null = null;

    constructor() {
        super();
        this.addFile = this.addFile.bind(this);
        this.onFileClose = this.onFileClose.bind(this);
        this.onTabToFront = this.onTabToFront.bind(this);
        this.onTabSwap = this.onTabSwap.bind(this);
        this.editorDidMount = this.editorDidMount.bind(this);
    }

    @computed get tabs(): Array<ITabProps> {
        const tabs: Array<ITabProps> = [];
        this.order.map((id: string) => {
            const file = this.files.get(id);
            if (file) {
                tabs.push({
                    id: file.id,
                    text: file.title,
                    tooltip: file.path,
                    modified: file.modified
                });
            }
        });
        return tabs;
    }

    @computed get doc(): IEditorProps {
        if (this.activeID && this.files.has(this.activeID)) {
            return {
                id: this.activeID,
                value: this.files.get(this.activeID).value,
                language: 'markdown'
            };
        } else {
            return {
                id: null,
                value: null,
                language: null
            };
        }
    }

    @action
    public addFile(file: IFile): FileInstance {
        const _file: FileInstance = new FileInstance(file);
        this.files.set(_file.id, _file);
        this.order.push(_file.id);
        this.activeID = _file.id;
        this.history.push(_file.id);
        return _file;
    }

    @action
    public onFileClose(id: string): void {
        if (this.files.has(id)) {
            this.files.delete(id);
            this.history = this.history.filter((hid: string) => {
                return hid !== id;
            });
            this.order = this.order.filter((hid: string) => {
                return hid !== id;
            });
            if (id === this.activeID && this.history.length) {
                this.activeID = this.history[this.history.length - 1];
                if (this.files.has(this.activeID)) {
                    this.trigger('moveToFront', this.activeID, this.files.get(this.activeID).value);
                }
            }
            if (id === this.activeID && !this.history.length) {
                this.trigger('moveToFront', -1, '');
            }
        }
    }

    @action
    public onTabToFront(id: string): void {
        if (this.history[this.history.length - 1] !== id) {
            this.history.push(id);
        }
        this.activeID = id;
        if (this.files.get(id)) {
            this.trigger('moveToFront', id, this.files.get(id).value);
        }
    }

    @action
    public onTabSwap(fromID: string, toID: string): void {
        if (fromID === toID) return;
        const from = this.order.indexOf(fromID);
        const to = this.order.indexOf(toID);
        if (from !== -1 && to !== -1) {
            this.order[from] = toID;
            this.order[to] = fromID;
        }
        this.onTabToFront(fromID);
    }

    public editorDidMount(editor: any) {
        this.editor = editor;
        this.trigger('ready', editor);

        editor.onDidChangeModelContent(() => {
            this.editorDidChange(this.activeID, editor.getModel().getValue());
        });

        editor.onDidScrollChange(() => {
            this.editorDidScroll(this.activeID, editor.getCompletelyVisibleLinesRangeInViewport().startLineNumber);
        });
    }

    @action
    protected editorDidChange(id: string, content: string): void {
        const file: FileInstance = this.files.get(id);
        if (!file) return;
        file.value = content;
        this.trigger('change', id, content);
    }

    @action
    protected editorDidScroll(id: string, line: number) {
        this.trigger('scroll', id, line);
    }

    public getActiveID(): string {
        return this.activeID;
    }

}