import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TabBarFrame from './TabBarFrame';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import styles from './less/index.less';

@DragDropContext(HTML5Backend)
export default class TabBar extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    render() {

        const {actions, state} = this.props;

        return (
            <div className={styles['TabBar']}>
                <TabBarFrame key='TabBarFrame'
                             actions={actions}
                             state={state}
                />
            </div>
        );
    }
}
