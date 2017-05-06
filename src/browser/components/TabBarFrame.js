import React, {Component} from "react";
import PropTypes from "prop-types";
import {DropTarget} from "react-dnd";
import TabDraggable from "./TabDraggable";
import {TAB as TabType} from '../constants/dndTypes';
import styles from "./less/index.less"

const cardTarget = {
    drop() {
    },
};

@DropTarget(TabType, cardTarget, connect => ({
    dnd_connectDropTarget: connect.dropTarget(),
}))
export default class TabBarFrame extends Component {

    static propTypes = {
        //dnd_connectDropTarget: PropTypes.func.isRequired,
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    render() {
        const {dnd_connectDropTarget, actions, state} = this.props;

        const tabs = state.order.map(id => state.tabs[id]);

        return dnd_connectDropTarget(
            <div className={styles["TabBarFrame"]}>
                {tabs.map((tab) => (
                    <TabDraggable key={tab.id}
                                  id={tab.id}
                                  title={tab.title}
                                  active={tab.id === state.active}
                                  modified={tab.modified}
                                  actions={actions}
                    />
                ))}
            </div>
        );
    }
}
