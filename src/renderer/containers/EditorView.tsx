import * as React from 'react';
import {observer} from 'mobx-react';
import FileModel from '../models/FileModel'
import Editor from '../components/Editor/index';
import TabBar from '../components/TabBar/index';
const styles = require<any>('./EditorView.less');

export interface  IEditorViewProps {
    fileModel: FileModel
}

export interface IEditorProps {
    id: string,
    value?: string,
    language: string
}

@observer
class EditorView extends React.Component<IEditorViewProps, undefined> {

    render() {
        const {fileModel} = this.props;

        return (
            <div className={styles['EditorView']}>
                <div className={styles['EditorView_TabBar']}>
                    <TabBar key='tab'
                            tabs={fileModel.tabs}
                            onClose={fileModel.removeFile}
                            onClick={fileModel.moveFileToFront}
                            onTabSwap={fileModel.swapTabs}
                            activeID={fileModel.getActiveID()}
                    />
                </div>
                <div className={styles['EditorView_Editor']}>
                    <Editor key='editor'
                            id={fileModel.doc.id}
                            value={fileModel.doc.value}
                            language={fileModel.doc.language}
                            registerEditor={fileModel.registerEditor}
                    />
                </div>
            </div>
        );
    }
}

export default EditorView;