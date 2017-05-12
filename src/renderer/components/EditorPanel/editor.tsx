import * as React from 'react';

declare const monaco: any;

export interface IEditorComponentProps {
    id: string,
    active: boolean,
    content?: string,
    onChange?: {
        (id: string, content: string): void
    },
    onScroll?: {
        (id: string, line: number): void
    }
}

export default class Editor extends React.Component<IEditorComponentProps, undefined> {

    protected element: HTMLElement;

    private editor: any;

    constructor(props: IEditorComponentProps) {
        super(props);
        this.layout = this.layout.bind(this);
    }

    protected layout(): void {
        this.props.active && this.editor && this.editor.layout();
    };

    componentDidMount() {
        const {id, content, onChange, onScroll} = this.props;

        const editor = monaco.editor.create(this.element, {
            value: content || '',
            language: 'markdown',
            theme: 'vs-dark'
        });
        editor.onDidChangeModelContent(() => {
            onChange && onChange(id, editor.getModel().getValue());
        });

        editor.onDidScrollChange(() => {
            onScroll && onScroll(id, editor.getCompletelyVisibleLinesRangeInViewport().startLineNumber);
        });

        window.addEventListener('resize', this.layout);
        this.editor = editor;
    }

    shouldComponentUpdate(nextProps: IEditorComponentProps) {
        return nextProps.active !== this.props.active;
    }

    componentDidUpdate() {
        if (this.props.active && this.editor) this.editor.layout();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.layout);
        this.editor.dispose();
    }

    render() {

        const {active} = this.props;

        const style = {
            width: '100%',
            height: '100%',
            display: active ? 'block' : 'none'
        };

        return (
            <div style={style} ref={ref => {
                this.element = ref;
            }}>
            </div>
        );
    }
}
