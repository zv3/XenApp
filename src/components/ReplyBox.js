import React from "react"
import {View, TextInput, Dimensions, Text, KeyboardAvoidingView} from "react-native"
import {style} from "../Style"
import {Button} from "./Button"
import PropTypes from "prop-types"

export const REPLY_STATE = {
    NONE: 'none',
    SENDING: 'sending',
    RESET: 'reset'
};

class ReplyBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };
    }

    clear() {
        this.refs.input.clear();
        this.setState({ text: '' });
    }

    _doReply() {
        if (this.state.text.length > 0) {
            this.props.onReply(this.state.text);
        }
    }

    _onChangeText(text) {
        const textTrimmed = text.replace(/^(\s+|\n)|(\s+|\n)$/g, '');
        this.setState({
            text: textTrimmed
        });
    }

    render() {
        const inputStyle = {
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,.1)',
            borderLeftWidth: 1,
            borderLeftColor: 'rgba(0,0,0,.1)',
            borderRightWidth: 1,
            borderRightColor: 'rgba(0,0,0,.1)',
            borderRadius: 4,
            paddingLeft: 10,
            paddingRight: 10,

            paddingTop: 5,
            paddingBottom: 5,

            width: Dimensions.get('window').width - 80 - 20
        };

        const buttonStyle = {
            padding: 0,
            height: 35,
            width: 80,
            backgroundColor: 'transparent'
        };

        let inputEditable, buttonDisable, inputValue = this.state.text;
        if (this.state.text.length > 0) {
            buttonDisable = this.props.replyState === REPLY_STATE.SENDING;
        } else {
            buttonDisable = true;
        }

        inputEditable = this.props.replyState !== REPLY_STATE.SENDING;

        return (
            <View style={style.replyBox.container}>
                <Text>You are replying Nobita</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        ref="input"
                        style={[style.input.normal, inputStyle]}
                        placeholder="Reply"
                        multiline={true}
                        editable={inputEditable}
                        value={inputValue}
                        onChangeText={(text) => this._onChangeText(text)}
                        placeholderTextColor={style.input.placeholder.color}/>
                    <Button text="Reply" type="default"
                            style={buttonStyle}
                            disabled={buttonDisable}
                            onPress={() => this._doReply()}/>
                </View>
            </View>
        );
    }
}
ReplyBox.propTypes = {
    onReply: PropTypes.func.isRequired,
    replyState: PropTypes.string.isRequired
};

export default ReplyBox