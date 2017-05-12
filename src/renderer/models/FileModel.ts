import {observable, computed, action} from 'mobx';
import {ITabProps} from '../components/TabBar/index';
import {IEditorProps} from '../components/EditorPanel/index';
import EventEmitter from '../utils/EventEmitter';
import IDGenerator from '../utils/IDGenerator';

export interface IFile {
    title: string,
    path: string,
    content: string
}


class IFileInstance implements IFile {
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

export default class FileModel extends EventEmitter {

    @observable public files: Map<string, IFileInstance> = new Map();

    protected history: Array<string> = [];

    @observable protected order: Array<string> = [];

    @observable public activeID: string | null = null;

    constructor() {
        super();
        this.addFile = this.addFile.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.moveFileToFront = this.moveFileToFront.bind(this);
        this.swapTabs = this.swapTabs.bind(this);
        this.modifyEditor = this.modifyEditor.bind(this);
        this.scrollEditor = this.scrollEditor.bind(this);
    }

    @action
    public addFile(file: IFile): IFileInstance {
        const _file: IFileInstance = new IFileInstance(file);
        this.files.set(_file.id, _file);
        this.order.push(_file.id);
        this.activeID = _file.id;
        this.history.push(_file.id);
        return _file;
    }

    @action
    public removeFile(id: string): void {
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
    public moveFileToFront(id: string): void {
        if (this.history[this.history.length - 1] !== id) {
            this.history.push(id);
        }
        this.activeID = id;
        if (this.files.get(id)) {
            this.trigger('moveToFront', id, this.files.get(id).value);
        }
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

    @action
    public swapTabs(fromID: string, toID: string): void {
        if (fromID === toID) return;
        const from = this.order.indexOf(fromID);
        const to = this.order.indexOf(toID);
        if (from !== -1 && to !== -1) {
            this.order[from] = toID;
            this.order[to] = fromID;
        }
        this.moveFileToFront(fromID);
    }


    @computed get editors(): Array<IEditorProps> {
        const editors: Array<IEditorProps> = [];
        this.files.forEach((file: IFileInstance, id: string) => {
            editors.push({
                id: id,
                content: file.content
            });
        });
        return editors;
    }

    @action
    modifyEditor(id: string, content: string): void {
        const file: IFileInstance = this.files.get(id);
        if (!file) return;
        file.value = content;
        this.trigger('change', id, content);
    }

    @action
    scrollEditor(id: string, line: number) {
        this.trigger('scroll', id, line);
    }

}