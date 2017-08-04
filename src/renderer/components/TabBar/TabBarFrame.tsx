import * as React from 'react';
import {DropTarget} from 'react-dnd';
import TabDraggable, {TAB_DND_TYPE} from './TabDraggable';
import {ITabClickCallback, ITabCloseCallback} from './Tab'

const styles = require('./less/index.less');

export interface ITabProps {
    id: string,
    text?: string,
    tooltip?: string,
    modified: boolean
}

export interface ITabBarFrameProps {
    tabs: Array<ITabProps>,
    dnd_connectDropTarget?: (component: any) => any,
    activeID: string,
    onClick?: ITabClickCallback,
    onClose?: ITabCloseCallback,
    onTabSwap?: (fromID: string, toID: string) => any
}

const cardTarget = {
    drop() {
    },
};

@DropTarget<ITabBarFrameProps>(TAB_DND_TYPE, cardTarget, (connect, monitor) => ({
    dnd_connectDropTarget: connect.dropTarget()
}))
export default class TabBarFrame extends React.Component<ITabBarFrameProps, undefined> {

    render() {
        const {tabs, activeID, dnd_connectDropTarget, onClick, onClose, onTabSwap} = this.props;

        return dnd_connectDropTarget(
            <div className={styles['TabBarFrame']}>
                {tabs.map((tab) => (
                    <TabDraggable key={tab.id}
                                  id={tab.id}
                                  text={tab.text}
                                  tooltip={tab.tooltip}
                                  active={tab.id === activeID}
                                  modified={tab.modified}
                                  onClick={onClick}
                                  onClose={onClose}
                                  onTabSwap={onTabSwap}
                    />
                ))}
            </div>
        );
    }
}
