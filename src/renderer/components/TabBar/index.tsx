import * as React from 'react';
import {DragDropContext} from 'react-dnd';
import * as HTML5Backend from 'react-dnd-html5-backend';

import TabBarFrame, {ITabProps} from './TabBarFrame';
import {ITabClickCallback, ITabCloseCallback} from './Tab'
const styles = require<any>('./less/index.less');

export {ITabProps};

export interface ITabBarProps {
    tabs: Array<ITabProps>,
    activeID?: string,
    onClick?: ITabClickCallback,
    onClose?: ITabCloseCallback,
    onTabSwap?: (fromID: string, toID: string) => any
}

@DragDropContext<ITabBarProps>(HTML5Backend)
export default class TabBar extends React.Component<ITabBarProps, undefined> {

    render() {
        const {activeID, tabs, onClick, onClose, onTabSwap} = this.props;
        return (
            <div className={styles['TabBar']}>
                <TabBarFrame key='TabBarFrame'
                             onTabSwap={onTabSwap}
                             onClick={onClick}
                             onClose={onClose}
                             activeID={activeID}
                             tabs={tabs}
                />
            </div>
        );
    }
}
