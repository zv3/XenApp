import React from "react"
import {View, Text, StyleSheet, Dimensions, TextInput} from "react-native"
import {ButtonIcon} from "./Button"
import PropTypes from "prop-types"

export default class ReplyBox extends React.Component {
    state = {
        message: '',
        quoteUser: '',
        isSubmitting: false
    };

    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    };

    setMessage(message) {
        this.setState({ message: message });
    }

    clear() {
        this.setState({
            message: '',
            isSubmitting: false
        });
    }

    message() {
        if (!this.state.message) {
            return '';
        }

        return this.state.message.replace(/^(\n|\s+)|(\n|\s+)$/g, '');
    }

    _doSubmit() {
        const message = this.message();
        if (message.length === 0) {
            return;
        }

        this.setState({
            isSubmitting: true
        });

        this.props.onSubmit(message);
    }

    _doRenderQuoteText() {
    }

    render() {
        const isDisabled = this.message().length === 0 || this.state.isSubmitting;

        let iconColor = 'white', buttonStyle;
        if (isDisabled) {
            iconColor = 'rgba(0,0,0,.26)';
            buttonStyle = {
                backgroundColor: 'rgba(0,0,0,.12)'
            };
        }

        return (
            <View style={styles.container}>
                <TextInput style={styles.input}
                           multiline={true}
                           editable={!this.state.isSubmitting}
                           onChangeText={(message) => this.setMessage(message)}
                           value={this.state.message}
                           placeholder="Enter an message..."/>
                <ButtonIcon iconName="send"
                            iconColor={iconColor}
                            iconSize={20}
                            disabled={isDisabled}
                            onPress={() => this._doSubmit()}
                            style={[styles.sendButton, buttonStyle]}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#e7e7e7'
    },

    input: {
        paddingTop: 5,
        paddingBottom: 5
    },

    sendButton: {
        backgroundColor: '#ff4081',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1.5},
        shadowOpacity: 0.12,

        position: 'absolute',
        top: -15,
        right: 15
    }
});