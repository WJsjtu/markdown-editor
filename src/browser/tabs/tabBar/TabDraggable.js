import React, {Component} from "react";
import PropTypes from "prop-types";
import {DragSource, DropTarget} from "react-dnd";
import {getEmptyImage} from "react-dnd-html5-backend";
import Tab from "./Tab";
import ItemTypes from "./ItemTypes";
import styles from "./less/index.less";

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
            props.onMove(fromID, toID);
        }
    }
};

@DropTarget(ItemTypes.TAB, tabTarget, (connect, monitor) => ({
    dnd_connectDropTarget: connect.dropTarget(),
    dnd_isOver: monitor.isOver()
}))
@DragSource(ItemTypes.TAB, tabSource, (connect, monitor) => ({
    dnd_connectDragSource: connect.dragSource(),
    dnd_connectDragPreview: connect.dragPreview(),
    dnd_isDragging: monitor.isDragging()
}))
export default class TabDraggable extends Component {
    static propTypes = {
        dnd_connectDragSource: PropTypes.func.isRequired,
        dnd_connectDropTarget: PropTypes.func.isRequired,
        dnd_isDragging: PropTypes.bool.isRequired,
        dnd_isOver: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        title: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
        style: PropTypes.object.isRequired,
        onMove: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        setTabReferences: PropTypes.func.isRequired
    };

    componentDidMount() {
        // Use empty image as a drag preview so browsers don"t draw it
        // and we can draw whatever we want on the custom drag layer instead.
        this.props.dnd_connectDragPreview(getEmptyImage(), {
            // IE fallback: specify that we"d rather screenshot the node
            // when it already knows it"s being dragged so we can hide it with CSS.
            captureDraggingState: true,
        });

        this.props.setTabReferences(this.props.id, this.$element);
    }

    render() {
        const {style, title, active, dnd_isOver, dnd_isDragging, dnd_connectDragSource, dnd_connectDropTarget, onClick, onClose} = this.props;

        return (
            <div className={styles["draggable"]} ref={ref => {
                this.$element = ref;
            }}>
                {dnd_connectDragSource(dnd_connectDropTarget(
                    <div>
                        <Tab title={title}
                             style={style}
                             onClick={onClick}
                             onClose={onClose}
                             mode={dnd_isOver ? "hover" : (active ? "active" : "hidden")}/>
                    </div>
                ))}
            </div>
        );
    }
}
