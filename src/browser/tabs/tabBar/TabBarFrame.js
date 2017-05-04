import React, {Component} from "react";
import PropTypes from "prop-types";
import {DropTarget} from "react-dnd";
import TabDraggable from "./TabDraggable";
import ItemTypes from "./ItemTypes";
import styles from "./less/index.less"

const cardTarget = {
    drop() {
    },
};

@DropTarget(ItemTypes.TAB, cardTarget, connect => ({
    dnd_connectDropTarget: connect.dropTarget(),
}))
export default class TabBarFrame extends Component {

    static propTypes = {
        dnd_connectDropTarget: PropTypes.func.isRequired,
        tabs: PropTypes.array.isRequired,
        onTabMove: PropTypes.func.isRequired,
        onTabClick: PropTypes.func.isRequired,
        onTabClose: PropTypes.func.isRequired,
        activeID: PropTypes.number.isRequired,
        tabStyle: PropTypes.object.isRequired,
        setTabReferences: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.tabReferences = {};
    }

    render() {
        const {dnd_connectDropTarget, onTabClick, onTabClose, onTabMove, tabStyle, setTabReferences, activeID} = this.props;

        return dnd_connectDropTarget(
            <div className={styles["TabBarFrame"]}>
                {this.props.tabs.map(tab => (
                    <TabDraggable
                        setTabReferences={setTabReferences}
                        active={tab.id === activeID}
                        key={tab.id}
                        id={tab.id}
                        title={tab.title}
                        onClick={onTabClick.bind(this, tab)}
                        onClose={onTabClose.bind(this, tab)}
                        onMove={onTabMove}
                        style={tabStyle}
                    />
                ))}
            </div>
        );
    }
}
