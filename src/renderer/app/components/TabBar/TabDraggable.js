import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DragSource, DropTarget} from 'react-dnd';
import Tab from './Tab';
import {TAB as TabType} from '../../constants/dndTypes';
import styles from './less/index.less';

const tabSource = {
    beginDrag(props) {
        return {
            id: props.id
        };
    }
};

const tabTarget = {
    canDrop: () => true,
    drop(props, monitor) {
        const {id: fromID} = monitor.getItem();
        const {id: toID} = props;

        if (fromID !== toID) {
            props.actions.swapTab(fromID, toID);
        }
    }
};

@DropTarget(TabType, tabTarget, (connect, monitor) => ({
    dnd_connectDropTarget: connect.dropTarget(),
    dnd_isOver: monitor.isOver()
}))
@DragSource(TabType, tabSource, (connect, monitor) => ({
    dnd_connectDragSource: connect.dragSource(),
    dnd_connectDragPreview: connect.dragPreview(),
    dnd_isDragging: monitor.isDragging()
}))
export default class TabDraggable extends Component {
    static propTypes = {
        //dnd_connectDragSource: PropTypes.func.isRequired,
        //dnd_connectDropTarget: PropTypes.func.isRequired,
        //dnd_isDragging: PropTypes.bool.isRequired,
        //dnd_isOver: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        title: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
        modified: PropTypes.bool.isRequired,
        actions: PropTypes.object.isRequired
    };

    render() {
        const {id, actions, title, active, modified, dnd_isOver, dnd_isDragging, dnd_connectDragSource, dnd_connectDropTarget} = this.props;

        return (
            <div className={styles['draggable']}>
                {dnd_connectDragSource(dnd_connectDropTarget(
                    <div>
                        <Tab id={id}
                             title={title}
                             actions={actions}
                             modified={modified}
                             mode={dnd_isOver ? 'hover' : (active ? 'active' : 'hidden')}/>
                    </div>
                ))}
            </div>
        );
    }
}
