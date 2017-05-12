import * as React from 'react';
import {DragSource, DropTarget} from 'react-dnd';

import Tab, {ITabCloseCallback, ITabClickCallback} from './Tab';
const styles = require<any>('./less/index.less');

export interface IDraggableTagProps {
    dnd_connectDragSource?: any,
    dnd_connectDropTarget?: any,
    dnd_isDragging?: boolean,
    dnd_isOver?: boolean,

    id: string,
    text?: string,
    tooltip?: string,
    modified: boolean,
    onClose?: ITabCloseCallback,
    onClick?: ITabClickCallback

    active: boolean,
    onTabSwap?: (fromID: string, toID: string) => any
}

export const TAB_DND_TYPE: string = 'TAB_DND_TYPE';

const tabSource = {
    beginDrag(props: IDraggableTagProps) {
        return {
            id: props.id
        };
    }
};

const tabTarget = {
    canDrop: () => true,
    drop(props: IDraggableTagProps, monitor: any) {
        const {id: fromID} = monitor.getItem();
        const {id: toID} = props;

        if (fromID !== toID) {
            props.onTabSwap && props.onTabSwap(fromID, toID);
        }
    }
};

@DropTarget<IDraggableTagProps>(TAB_DND_TYPE, tabTarget, (connect, monitor) => ({
    dnd_connectDropTarget: connect.dropTarget(),
    dnd_isOver: monitor.isOver()
}))
@DragSource<IDraggableTagProps>(TAB_DND_TYPE, tabSource, (connect, monitor) => ({
    dnd_connectDragSource: connect.dragSource(),
    dnd_connectDragPreview: connect.dragPreview(),
    dnd_isDragging: monitor.isDragging()
}))
export default class DraggableTab extends React.Component<IDraggableTagProps, undefined> {

    render() {
        const {id, active, onClick, onClose, text, tooltip, modified, dnd_isOver, dnd_isDragging, dnd_connectDragSource, dnd_connectDropTarget} = this.props;
        return (
            <div className={styles['draggable']}>
                {dnd_connectDragSource(dnd_connectDropTarget(
                    <div>
                        <Tab id={id}
                             text={text}
                             tooltip={tooltip}
                             onClick={onClick}
                             onClose={onClose}
                             modified={modified}
                             mode={dnd_isOver ? 'hover' : (active ? 'active' : 'hidden')}/>
                    </div>
                ))}
            </div>
        );
    }
}
