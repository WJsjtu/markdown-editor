import * as React from 'react';
import {observer} from 'mobx-react';
import FileModel from '../models/FileModel'
import TabBar from '../components/TabBar/index';

export interface  ITabViewProps {
    fileModel: FileModel
}

@observer
class TabView extends React.Component<ITabViewProps, undefined> {
    render() {
        return (
            <TabBar tabs={this.props.fileModel.tabs}
                    onClose={this.props.fileModel.removeFile}
                    onClick={this.props.fileModel.moveFileToFront}
                    onTabSwap={this.props.fileModel.swapTabs}
                    activeID={this.props.fileModel.activeID}
            />
        );
    }
}

export default TabView;