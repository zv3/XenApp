import React from 'react';
import {
    TouchableOpacity,
    Text,
    Platform,
    TouchableWithoutFeedback,
    View,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

export default class Button extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        children: PropTypes.node,
        textProps: PropTypes.object,
        accessibilityLabel: PropTypes.string,
        testID: PropTypes.string,
        textStyle: PropTypes.object,
        style: PropTypes.any
    };

    render() {
        let textComponent;
        const {
            title,
            onPress,
            disabled,
            children,
            accessibilityLabel,
            testID,
            style,
            textStyle
        } = this.props;

        const Touchable =
            Platform.OS === 'ios' ? TouchableOpacity : TouchableWithoutFeedback;

        const buttonStyles = [styles.button, style];
        const textStyles = [styles.text, textStyle];
        const accessibilityStates = [];

        if (disabled) {
            buttonStyles.push(styles.buttonDisabled);
            textStyles.push(styles.textDisabled);
            accessibilityStates.push('disabled');
        }

        if (title.length > 0) {
            const formattedTitle =
                Platform.OS === 'android' ? title.toUpperCase() : title;
            textComponent = (
                <Text style={textStyles} disabled={disabled}>
                    {formattedTitle}
                </Text>
            );
        }

        return (
            <Touchable
                onPress={() => onPress()}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                accessibilityStates={accessibilityStates}
                testID={testID}
                disabled={disabled}>
                <View style={buttonStyles}>
                    {children}
                    {textComponent}
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    button: Platform.select({
        ios: {},
        android: {
            elevation: 4,
            // Material design blue from https://material.google.com/style/color.html#color-color-palette
            backgroundColor: '#2196F3',
            borderRadius: 2
        }
    }),
    text: Platform.select({
        ios: {
            // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
            color: '#007AFF',
            textAlign: 'center',
            padding: 8,
            fontSize: 18
        },
        android: {
            color: 'white',
            textAlign: 'center',
            padding: 8,
            fontWeight: '500'
        }
    }),
    buttonDisabled: Platform.select({
        ios: {
            opacity: 0.8
        },
        android: {
            elevation: 0,
            backgroundColor: '#dfdfdf'
        }
    }),
    textDisabled: Platform.select({
        ios: {
            color: '#cdcdcd'
        },
        android: {
            color: '#a1a1a1'
        }
    })
});
