import React, {Component} from "react";
import PropTypes from "prop-types";
import TabBarFrame from "./TabBarFrame";
import TabDragLayer from "./TabDragLayer";
import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import styles from "./less/index.less";

@DragDropContext(HTML5Backend)
export default class TabBar extends Component {

    static propTypes = {
        tabs: PropTypes.array.isRequired,
        onTabClick: PropTypes.func,
        onTabClose: PropTypes.func,
        activeID: PropTypes.number,
        tabStyle: PropTypes.object
    };

    static defaultProps = {
        tabs: [],
        onTabClick: (tab, cb) => cb(),
        onTabClose: (tab, cb) => cb(),
        activeID: -1,
        tabStyle: {}
    };

    constructor(props) {
        super(props);
        this.onTabMove = ::this.onTabMove;
        this.onTabClick = ::this.onTabClick;
        this.onTabClose = ::this.onTabClose;
        this.findTab = ::this.findTab;
        this.setTabReferences = ::this.setTabReferences;

        this.tabReferences = {};

        this.state = {
            tabs: this.props.tabs,
            activeID: this.props.activeID
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.tabs !== nextProps.tabs || this.state.activeID !== nextProps.activeID) {
            this.setState({
                tabs: nextProps.tabs,
                activeID: nextProps.activeID
            });
        }
    }

    onTabClick(tab) {
        this.props.onTabClick(tab, () => {
            this.setState({
                activeID: tab.id
            });
        });
    }

    onTabClose(tab) {
        this.props.onTabClose(tab, () => {
            const tabs = this.state.tabs;
            const index = tabs.indexOf(tab);
            if (index !== -1) {
                tabs.splice(index, 1);
                this.setState({
                    tabs: tabs
                });
            }
        });

    }

    onTabMove(fromID, toID) {

        if (fromID !== toID) {
            const tabs = this.state.tabs;

            const sourceTab = this.findTab(fromID);
            const targetTab = this.findTab(toID);

            if (sourceTab && targetTab) {

                const sourceIndex = sourceTab.index;
                const targetIndex = targetTab.index;

                tabs.splice(sourceTab.index, 1);
                tabs.splice(tabs.indexOf(targetTab.tab) + (targetIndex > sourceIndex ? 1 : 0), 0, sourceTab.tab);

                this.setState({
                    tabs: tabs
                });
            }
        }
    }

    findTab(id) {

        for (let i = 0, l = this.state.tabs.length; i < l; i++) {
            if (this.state.tabs[i].id === id) {
                return {
                    index: i,
                    tab: this.state.tabs[i]
                }
            }
        }

        return null;
    }

    setTabReferences(id, $tab) {
        this.tabReferences[id] = $tab;
    }


    render() {
        return (
            <div className={styles["TabBar"]}>
                <TabBarFrame key="TabBarFrame"
                             tabs={this.state.tabs}
                             onTabMove={this.onTabMove}
                             onTabClick={this.onTabClick}
                             onTabClose={this.onTabClose}
                             tabStyle={this.props.tabStyle}
                             activeID={this.state.activeID}
                             setTabReferences={this.setTabReferences}
                />
                <TabDragLayer key="TabDragLayer" findTab={this.findTab} tabReferences={this.tabReferences}/>
            </div>
        );
    }
}
