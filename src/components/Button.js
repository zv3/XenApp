import React from "react"
import {TouchableOpacity, Text} from "react-native"
import PropTypes from "prop-types"
import Icon from "react-native-vector-icons/Feather"

class Button extends React.Component {
    static propTypes = {
        text: PropTypes.string,
        type: PropTypes.string,
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        iconView: PropTypes.object,
        textProps: PropTypes.object
    };

    static defaultProps = {
        type: 'default',
        disabled: false
    };

    render() {
        let textView;

        if (this.props.text && this.props.text.length > 0) {
            textView = (<Text style={{ fontSize: 18 }} {...this.props.textProps}>{this.props.text}</Text>);
        }

        return (
            <TouchableOpacity
                style={this.props.style}
                disabled={this.props.disabled}
                onPress={this.props.onPress}>
                {this.props.iconView}
                {textView}
            </TouchableOpacity>
        );
    }
}

class ButtonIcon extends React.Component {
    static propTypes = {
        iconName: PropTypes.string.isRequired,
        iconSize: PropTypes.number,
        iconColor: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        iconSize: 25,
        disabled: false
    };

    render() {
        let iconStyle;
        if (this.props.text) {
            iconStyle = {marginRight: 5};
        }

        // const _style = getButtonStyle(this.props.type, this.props.disabled),
        //     textStyle = _style.text;
        //
        // let iconColor;
        // if (this.props.disabled) {
        //     iconColor = textStyle.color;
        // } else {
        //     if (this.props.iconColor) {
        //         iconColor = this.props.iconColor;
        //     } else if (textStyle) {
        //         iconColor = textStyle.color;
        //     }
        // }

        const iconView = (<Icon name={this.props.iconName}
                                style={iconStyle}
                                color={this.props.iconColor}
                                size={this.props.iconSize} />);

        return <Button {...this.props} iconView={iconView}/>;
    }
}

export {
    Button, ButtonIcon
};