import * as React from 'react';

const styles = require<any>('./less/index.less');

export type TabMode = 'hidden' | 'active' | 'layer' | 'hover';

export interface ITabCloseCallback {
    (id: string): void
}

export interface ITabClickCallback {
    (id: string): void
}

export interface ITabComponentProps {
    id: string,
    text?: string,
    tooltip?: string,
    mode: TabMode,
    modified: boolean,
    onClose?: ITabCloseCallback,
    onClick?: ITabClickCallback
}


export default class Tab extends React.PureComponent<ITabComponentProps, undefined> {

    constructor(props: ITabComponentProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onClick(event: any): any {
        event.stopPropagation();
        this.props.onClick && this.props.onClick(this.props.id);
    }

    onClose(event: any): any {
        event.stopPropagation();
        this.props.onClose && this.props.onClose(this.props.id);
    }

    render() {

        const {text, tooltip, mode, modified} = this.props;

        const className: string = [styles['tab'], styles[mode]].join(' ');

        return (
            <div className={className} onClick={this.onClick} title={tooltip || undefined}>
                <div className={(styles['title'])}>{text || ''}</div>
                <div className={styles['close']} onClick={this.onClose}>{modified ? (
                    <span className='glyphicon glyphicon-remove-circle'> </span>
                ) : (
                    <span className='glyphicon glyphicon-remove'> </span>
                )}</div>
            </div>
        );
    }
}
