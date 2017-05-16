import * as React from 'react';
import {observer} from 'mobx-react';
import EditorModel from '../models/EditorModel'
import Editor from '../components/Editor/index';
import TabBar from '../components/TabBar/index';
const styles = require<any>('./EditorView.less');

export interface  IEditorViewProps {
    editorModel: EditorModel
}

export interface IEditorProps {
    id: string,
    value?: string,
    language: string
}

@observer
class EditorView extends React.Component<IEditorViewProps, undefined> {

    render() {
        const {editorModel} = this.props;

        return (
            <div className={styles['EditorView']}>
                <div className={styles['EditorView_TabBar']}>
                    <TabBar key='tab'
                            tabs={editorModel.tabs}
                            onClose={editorModel.onFileClose}
                            onClick={editorModel.onTabToFront}
                            onTabSwap={editorModel.onTabSwap}
                            activeID={editorModel.getActiveID()}
                    />
                </div>
                <div className={styles['EditorView_Editor']}>
                    <Editor key='editor'
                            options={editorModel.options}
                            id={editorModel.doc.id}
                            value={editorModel.doc.value}
                            language={editorModel.doc.language}
                            editorDidMount={editorModel.editorDidMount}
                    />
                </div>
            </div>
        );
    }
}

export default EditorView;