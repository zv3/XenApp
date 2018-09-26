import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import PropTypes from "prop-types";

export default class ButtonIcon extends React.Component {
    _onPressed() {
        this.props.onPress();
    }

    render() {
        let text;
        if (this.props.text && this.props.text.length > 0) {
            text = (<Text style={{ marginLeft: 5, ...this.props.textStyle }}>{this.props.text}</Text>);
        }

        const style = StyleSheet.create({
            container: {
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        });

        return (
            <TouchableOpacity
                style={[style.container, this.props.style]}
                onPress={() => this._onPressed()}>
                <Icon name={this.props.iconName}
                      style={[...this.props.iconStyle]} color={this.props.iconColor} size={this.props.iconSize} />
                {text}
            </TouchableOpacity>
        );
    }
}

ButtonIcon.propTypes = {
    iconName: PropTypes.string,
    iconStyle: PropTypes.object,
    iconColor: PropTypes.string,
    iconSize: PropTypes.number,

    text: PropTypes.string,
    textStyle: PropTypes.object,

    onPress: PropTypes.func
};
ButtonIcon.defaultProps = {
    iconSize: 20,
    iconStyle: {},

    textStyle: {},
    onPress: () => {}
};