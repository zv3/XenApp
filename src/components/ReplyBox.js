import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import ButtonIcon from './ButtonIcon';
import PropTypes from 'prop-types';

export default class ReplyBox extends React.PureComponent {
    state = {
        message: '',
        quoteUser: '',
        isSubmitting: false
    };

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        style: PropTypes.object
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

    _doSubmit = () => {
        const message = this.message();
        if (message.length === 0) {
            return;
        }

        this.setState({
            isSubmitting: true
        });

        this.props.onSubmit(message);
    };

    _doRenderQuoteText() {}

    render() {
        const { message, isSubmitting } = this.state;

        return (
            <View style={[styles.container, this.props.style]}>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    editable={!isSubmitting}
                    onChangeText={(message) => this.setMessage(message)}
                    value={message}
                    autoCorrect={false}
                    placeholder="Enter an message..."
                />
                <View style={styles.submit}>
                    <ButtonIcon
                        iconName="send"
                        iconSize={20}
                        iconColor={'#FFF'}
                        disabled={this.message().length === 0 || isSubmitting}
                        onPress={this._doSubmit}
                        style={styles.sendButton}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#e7e7e7'
    },

    input: {
        paddingTop: 5,
        paddingBottom: 5,
        flexGrow: 1
    },

    submit: {
        position: 'absolute',
        top: -15,
        right: 10
    },

    sendButton: {
        backgroundColor: '#ff4081',
        width: 36,
        height: 36,
        borderRadius: 18,
        shadowColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 1, height: 1.5 },
        shadowOpacity: 0.12
    }
});
