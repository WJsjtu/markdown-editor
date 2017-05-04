import React, {Component} from "react";
import PropTypes from "prop-types";
import {DragLayer} from "react-dnd";
import ItemTypes from "./ItemTypes";
import Tab from "./Tab";
import styles from "./less/index.less";

@DragLayer(monitor => ({
    dnd_item: monitor.getItem(),
    dnd_itemType: monitor.getItemType(),
    dnd_initialOffset: monitor.getInitialSourceClientOffset(),
    dnd_currentOffset: monitor.getSourceClientOffset(),
    dnd_isDragging: monitor.isDragging(),
}))
export default class TabDragLayer extends Component {

    static propTypes = {
        dnd_item: PropTypes.object,
        dnd_itemType: PropTypes.string,
        dnd_initialOffset: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        }),
        dnd_currentOffset: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        }),
        dnd_isDragging: PropTypes.bool.isRequired,
        findTab: PropTypes.func.isRequired,
        tabReferences: PropTypes.object
    };

    getItemStyles() {
        const {dnd_initialOffset, dnd_currentOffset} = this.props;
        if (!dnd_initialOffset || !dnd_currentOffset) {
            return {
                display: "none",
            };
        }
        const {x, y} = dnd_currentOffset;
        const transform = `translate(${x}px, ${y}px)`;
        return {
            transform,
            WebkitTransform: transform,
            MozTransform: transform,
            OTransform: transform
        };
    }

    render() {
        const {dnd_item, dnd_itemType, dnd_isDragging, tabReferences} = this.props;

        if (!dnd_isDragging) return null;

        const tabObject = this.props.findTab(dnd_item.id);

        if (!tabObject) return null;

        const style = {};

        if (tabReferences && tabReferences[dnd_item.id]) {
            const elementStyle = window.getComputedStyle(tabReferences[dnd_item.id], null);
            style.width = parseFloat(elementStyle.width, 10);
            style.height = parseFloat(elementStyle.height, 10);
        } else {
            style.display = "none";
        }


        return (
            <div className={styles["TabDragLayer"]} style={style}>
                <div style={this.getItemStyles()}>
                    {dnd_itemType === ItemTypes.TAB ?
                        <Tab title={tabObject.tab.title} mode="layer"/>
                        : null}
                </div>
            </div>
        );
    }
}
