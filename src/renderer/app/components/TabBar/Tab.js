import React, {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PropTypes from 'prop-types';
import styles from './less/index.less';

export default class Tab extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        mode: PropTypes.oneOf(['hidden', 'active', 'layer', 'hover']).isRequired,
        modified: PropTypes.bool.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.onClick = ::this.onClick;
        this.onClose = ::this.onClose;
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    onClick(e) {
        e.stopPropagation();
        this.props.actions.activateTab(this.props.id);
    }

    onClose(e) {
        e.stopPropagation();
        this.props.actions.closeTab(this.props.id);
    }

    render() {

        const {title, mode, modified} = this.props;

        return (
            <div className={[styles['tab'], styles[mode]].join(' ')} onClick={this.onClick}>
                <div className={styles['title']}>
                    {title}
                </div>
                <div className={styles['close']} onClick={this.onClose}>{modified ? (
                    <span className='glyphicon glyphicon-record'> </span>
                ) : (
                    <span className='glyphicon glyphicon-remove'> </span>
                )}</div>
            </div>
        );
    }
}
