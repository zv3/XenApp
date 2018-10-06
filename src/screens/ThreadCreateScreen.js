import React from "react"
import {View, StyleSheet, TextInput, CameraRoll} from "react-native"
import {Button} from "../components/Button";
import SnackBar from "../components/SnackBar";

export default class ThreadCreateScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return  {
            title: 'Create new thread'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            fields: {}
        };

        this._snackBar = null;
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

    _doRenderTextField(name, label) {
        return <TextInput
            editable={true}
            style={styles.input}
            placeholder={label}
            onTextChange={(text) => this._setFieldValue(name, text)}/>
    }

    _doSave() {
    }

    _doAttachFiles() {

    }

    render() {
        return (
            <View style={styles.container}>
                {this._doRenderTextField('thread_title', 'Thread Title')}
                {this._doRenderTextField('thread_body', 'Content')}

                <Button text="Attach files"
                        onPress={this._doAttachFiles}/>

                <Button
                    text="SAVE"
                    textProps={{ style: styles.buttonText }}
                    onPress={() => this._doSave()}
                    style={[styles.submit]}
                />
                <SnackBar
                    text=""
                    ref={(component) => (this._snackBar = component)}
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

        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.1)',

        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,.1)',

        borderLeftWidth: 1,
        borderLeftColor: 'rgba(0,0,0,.1)',

        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,.1)',

        color: 'red',
        fontSize: 18,
        backgroundColor: '#FFF',

        borderRadius: 4
    },

    submit: {
        backgroundColor: '#ff4081',
        width: '100%',
        padding: 5,
        borderRadius: 4,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    buttonText: {
        color: '#FFF',
        fontSize: 16
    }
});