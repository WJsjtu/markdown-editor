import * as React from 'react';

declare const monaco: any;

export interface IEditorComponentProps {
    id: string | null,
    language: string,
    value?: string | null,
    options: any,
    editorDidMount: {
        (editor: any): void
    }
}

interface IEditorState {
    model: any,
    viewState: any
}

const style = {
    width: '100%',
    height: '100%',
};

export default class Editor extends React.Component<IEditorComponentProps, undefined> {

    protected element: HTMLElement;

    public editor: any;

    protected editorStates: Map<string, IEditorState> = new Map();

    componentDidMount() {
        const {editorDidMount, options, language} = this.props;

        this.editor = monaco.editor.create(this.element, {
            ...options,
            model: null,
            language: language,
        });

        editorDidMount(this.editor);
    }

    componentWillReceiveProps(nextProps: IEditorComponentProps) {

        if (!this.editor) return;

        if (this.props.options !== nextProps.options) {
            this.editor.updateOptions(nextProps.options);
        }

        if (this.props.id === nextProps.id) return;

        if (nextProps.id === null) {

            this.editor.setModel(null);

        } else {

            if (this.props.id !== null && this.editorStates.has(this.props.id)) {
                const currentState: IEditorState = this.editorStates.get(this.props.id);
                currentState.viewState = this.editor.saveViewState();
            }

            if (this.editorStates.has(nextProps.id)) {
                const nextState: IEditorState = this.editorStates.get(nextProps.id);
                this.editor.setModel(nextState.model || null);
                if (nextState.viewState !== null) {
                    this.editor.restoreViewState(nextState.viewState);
                }
            } else {
                const newModel = monaco.editor.createModel(
                    nextProps.value || '',
                    nextProps.language
                );
                const newState: IEditorState = {
                    model: newModel,
                    viewState: null
                };
                this.editorStates.set(nextProps.id, newState);
                this.editor.setModel(newModel);
            }
        }
    }

    shouldComponentUpdate = () => false;

    componentWillUnmount() {
        this.editor.dispose();
    }

    render() {
        return (
            <div style={style} ref={ref => {
                this.element = ref;
            }}>
            </div>
        );
    }
}
