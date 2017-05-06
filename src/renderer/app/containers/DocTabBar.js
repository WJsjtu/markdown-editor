import React, {Component, createElement} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import TabBar from '../components/TabBar';
import * as tabActions from '../actions/tabActions';

@connect(mapState, mapDispatch)
class DocTabBar extends Component {

    render() {
        const {state, actions} = this.props;
        return (<TabBar state={state} actions={actions}/>);
    }
}

function mapState(state) {
    return {
        state: state.tabs
    };
}

function mapDispatch(dispatch) {
    return {
        actions: bindActionCreators(tabActions, dispatch)
    };
}

export default DocTabBar;