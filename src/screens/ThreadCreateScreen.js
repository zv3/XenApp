import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import Button from '../components/Button';
import ButtonIcon from '../components/ButtonIcon';

export default class ThreadCreateScreen extends React.Component {
    static navigationOptions = () => {
        return {
            title: 'Create new thread'
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            fields: {}
        };
    }

    _setFieldValue(name, value) {
        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                [name]: value
            }
        }));
    }

    _doRenderTextField(name, label, props) {
        return (
            <TextInput
                editable={true}
                style={styles.input}
                placeholder={label}
                autoCorrect={false}
                multiline={true}
                onTextChange={(text) => this._setFieldValue(name, text)}
                {...props}
            />
        );
    }

    _doSave() {}

    _doAttachFiles() {}

    render() {
        return (
            <View style={styles.container}>
                <Text>You are create thread in forum: XXXX</Text>
                {this._doRenderTextField('thread_title', 'Thread Title', {
                    maxLength: 100
                })}
                {this._doRenderTextField('thread_body', 'Content')}

                <Button title="Attach files" onPress={this._doAttachFiles} />

                <ButtonIcon
                    iconName={'save'}
                    iconColor={'#FFF'}
                    textColor={'#FFF'}
                    title="Save"
                    onPress={() => this._doSave()}
                    style={styles.submit}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },

    input: {
        width: '100%',
        marginBottom: 10,
        padding: 10,

        // borderBottomWidth: 1,
        // borderBottomColor: 'rgba(0,0,0,.1)',
        //
        // borderTopWidth: 1,
        // borderTopColor: 'rgba(0,0,0,.1)',
        //
        // borderLeftWidth: 1,
        // borderLeftColor: 'rgba(0,0,0,.1)',
        //
        // borderRightWidth: 1,
        // borderRightColor: 'rgba(0,0,0,.1)',

        // color: 'red',
        fontSize: 18,
        backgroundColor: '#FFF',

        borderRadius: 4
    },

    submit: {
        backgroundColor: '#ff4081',
        width: '100%',
        // padding: 5,
        borderRadius: 4,
        marginTop: 10
    }
});
