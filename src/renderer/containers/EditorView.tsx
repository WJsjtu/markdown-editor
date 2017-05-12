import * as React from 'react';
import {observer} from 'mobx-react';
import FileModel from '../models/FileModel'
import EditorPanel from '../components/EditorPanel/index';

export interface  IEditorViewProps {
    fileModel: FileModel
}

@observer
class EditorView extends React.Component<IEditorViewProps, undefined> {
    render() {
        return (
            <EditorPanel editors={this.props.fileModel.editors}
                         onScroll={this.props.fileModel.scrollEditor}
                         onChange={this.props.fileModel.modifyEditor}
                         activeID={this.props.fileModel.activeID}
            />
        );
    }
}

export default EditorView;