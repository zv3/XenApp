import React from "react";
import {View,Text, TouchableOpacity} from "react-native";
import PropTypes from "prop-types";

import {style} from "../Style"

class Button extends React.Component {
    render() {
        let containerStyle = [style.button.container];
        if (this.props.disabled) {
            containerStyle.push(style.button.disabled);
        } else {
            containerStyle.push(style.button[this.props.type]);
        }

        const ucFirst = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        let textStyle;
        if (this.props.disabled) {
            textStyle = 'textDisabled';
        } else {
            textStyle = `text${ucFirst(this.props.type)}`;
        }

        return (
            <TouchableOpacity
                style={[containerStyle, this.props.style]}
                disabled={this.props.disabled}
                onPress={this.props.onPress}>
                {this.props.iconView}
                <Text style={style.button[textStyle]}>{this.props.text}</Text>
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
    type: 'primary',
    disabled: false
};

export {
    Button
};