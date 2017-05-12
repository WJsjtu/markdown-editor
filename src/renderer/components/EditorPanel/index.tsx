import * as React from 'react';
import Editor from './editor';

export interface IEditorProps {
    id: string,
    content?: string
}

export interface IEditorPanelProps {
    editors: Array<IEditorProps>,
    activeID?: string,
    onChange?: {
        (id: string, content: string): void
    },
    onScroll?: {
        (id: string, line: number): void
    }
}

export default class EditorPanel extends React.Component<IEditorPanelProps, undefined> {

    render() {
        const {editors, activeID, onChange, onScroll} = this.props;
        return (
            <div style={{width: '100%', height: '100%'}}>
                {editors.map((editor: IEditorProps) => {
                    return (
                        <Editor key={editor.id}
                                id={editor.id}
                                content={editor.content}
                                onChange={onChange}
                                onScroll={onScroll}
                                active={activeID === editor.id}
                        />
                    );
                })}
            </div>
        );
    }
}
