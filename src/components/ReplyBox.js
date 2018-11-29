import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import ButtonIcon from './ButtonIcon';
import PropTypes from 'prop-types';

export default class ReplyBox extends React.PureComponent {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onTyping: PropTypes.func,
        style: PropTypes.object
    };

    _doSubmit = () => {
        const message = this.message();
        if (message.length === 0) {
            return;
        }

        this.toggleEnabled(false);
        this.props.onSubmit(message);
    };

    _presentFullScreen = () => {};

    _onFocus = () => this.setState({ isTyping: true });

    _onBlur = () => this.setState({ isTyping: false });

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            quoteUser: '',
            enabled: true,
            isTyping: false
        };

        this._layoutHeight = 40;
    }

    getLayoutHeight() {
        return this._layoutHeight;
    }

    setMessage(message) {
        this.setState({ message: message });
        const { onTyping } = this.props;

        if (onTyping) {
            onTyping(message);
        }
    }

    clear() {
        this.setState({
            message: '',
            enabled: true
        });
    }

    toggleEnabled(enabled: boolean): void {
        this.setState({ enabled });
    }

    message() {
        if (!this.state.message) {
            return '';
        }

        return this.state.message.replace(/^(\n|\s+)|(\n|\s+)$/g, '');
    }

    _doRenderQuoteText() {}

    render() {
        const { message, enabled, isTyping } = this.state;

        const groupButtons = [styles.submit];
        if (isTyping) {
            groupButtons.push({
                top: -25
            });
        }

        return (
            <View
                style={[styles.container, this.props.style]}
                onLayout={(ev) =>
                    (this._layoutHeight = ev.nativeEvent.layout.height)
                }>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    editable={enabled}
                    onChangeText={(message) => this.setMessage(message)}
                    value={message}
                    autoCorrect={false}
                    placeholder="Enter an message..."
                    maxHeight={40}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                />
                <View style={groupButtons}>
                    <ButtonIcon
                        iconName={'maximize-2'}
                        iconColor={'#FFF'}
                        iconSize={20}
                        style={styles.minMaxButton}
                        disabled={!enabled}
                        onPress={this._presentFullScreen}
                    />
                    <ButtonIcon
                        iconName="send"
                        iconSize={20}
                        iconColor={'#FFF'}
                        disabled={this.message().length === 0 || !enabled}
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
        flexGrow: 1,
        fontSize: 18
    },

    submit: {
        position: 'absolute',
        top: -15,
        right: 10,
        flexDirection: 'row'
    },

    minMaxButton: {
        backgroundColor: 'purple',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
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
