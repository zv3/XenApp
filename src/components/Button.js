import React from "react";
import {Text, TouchableOpacity} from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Feather";

import {style} from "../Style"

const getButtonStyle = (type, isDisabled) => {
    if (!type) {
        type = 'default';
    }

    let containerStyle = [style.button.container];
    if (isDisabled) {
        containerStyle.push(style.button.disabled);
    } else {
        containerStyle.push(style.button[type]);
    }

    const ucFirst = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const textStyle = isDisabled ? 'textDisabled' : `text${ucFirst(type)}`;

    return {
        container: containerStyle,
        text: style.button[textStyle]
    };
};

class Button extends React.Component {
    render() {
        let textView;

        const _style = getButtonStyle(this.props.type, this.props.disabled),
            containerStyle = _style.container,
            textStyle = _style.text;

        if (this.props.text && this.props.text.length > 0) {
            textView = (<Text style={[textStyle, { fontSize: 18}]}>{this.props.text}</Text>);
        }

        return (
            <TouchableOpacity
                style={[containerStyle, this.props.style]}
                disabled={this.props.disabled}
                onPress={this.props.onPress}>
                {this.props.iconView}
                {textView}
            </TouchableOpacity>
        );
    }
}
Button.propTypes = {
    text: PropTypes.string,
    type: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    iconView: PropTypes.object
};

Button.defaultProps = {
    type: 'default',
    disabled: false
};

class ButtonIcon extends React.Component {
    render() {
        let iconStyle;
        if (this.props.text) {
            iconStyle = {marginRight: 5};
        }

        const _style = getButtonStyle(this.props.type, this.props.disabled),
            textStyle = _style.text;

        let iconColor;
        if (this.props.disabled) {
            iconColor = textStyle.color;
        } else {
            if (this.props.iconColor) {
                iconColor = this.props.iconColor;
            } else if (textStyle) {
                iconColor = textStyle.color;
            }
        }

        const iconView = (<Icon name={this.props.iconName}
                                style={iconStyle}
                                color={iconColor}
                                size={this.props.iconSize} />);

        return <Button {...this.props} iconView={iconView}/>;
    }
}
ButtonIcon.propTypes = {
    iconName: PropTypes.string.isRequired,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string
};
ButtonIcon.defaultProps = {
    iconSize: 25
};

export {
    Button, ButtonIcon
};