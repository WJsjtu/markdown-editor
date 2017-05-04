import React, {Component} from "react";
import PureRenderMixin from "react-addons-pure-render-mixin";
import PropTypes from "prop-types";
import styles from "./less/index.less";

export default class Tab extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        mode: PropTypes.oneOf(["hidden", "active", "layer", "hover"]).isRequired,
        style: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.onClick = ::this.onClick;
        this.onClose = ::this.onClose;
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    onClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }

    onClose(e) {
        e.stopPropagation();
        this.props.onClose();
    }

    render() {

        const {style, title, mode} = this.props;

        return (
            <div style={style} className={[styles["tab"], styles[mode]].join(" ")} onClick={this.onClick}>
                <div className={styles["title"]}>
                    {title}
                </div>
                <div className={styles["close"]} onClick={this.onClose}>×</div>
            </div>
        );
    }
}
