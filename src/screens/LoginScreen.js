import React from "react"
import {View, AsyncStorage, TextInput,StyleSheet, ActivityIndicator} from "react-native"
import {Button} from "../components/Button";
import {passwordEncrypter} from "../utils/Encrypter";
import {CLIENT_ID} from "../Config";
import {fetcher} from "../utils/Fetcher";
import SnackBar from "../components/SnackBar";
import {NavigationActions} from "react-navigation"
import {saveToken, Token} from "../utils/Token";

export default class LoginScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Login'
        }
    };

    state = {
        data: {},
        isSubmitting: false
    };

    _onChangeText(name, value) {
        this.setState(prevState => ({
            ...prevState,
            data: {
                ...prevState.data,
                    [name]: value
            }
        }));
    }

    _doRenderField(name, placeholder) {
        let secureTextEntry = false, keyboardType = 'default';
        if (name.indexOf('password') === 0) {
            secureTextEntry = true;
        }

        return <TextInput
            editable={!this.state.isSubmitting}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            onChangeText={(text) => this._onChangeText(name, text)}
            placeholder={placeholder}/>
    }

    _doLogin() {
        this.setState({
            isSubmitting: true
        });

        if (this.refs.SnackBar) {
            this.refs.SnackBar.hide();
        }

        let payload = {
            username: this.state.data.username,
            password: passwordEncrypter(this.state.data.password),
            grant_type: 'password',
            client_id: CLIENT_ID,
            password_algo: 'aes128'
        };

        fetcher.post('oauth/token', { body: payload })
            .then((response) => {
                if (response.hasOwnProperty('access_token')) {
                    // login access.

                    Token.saveToken(response);

                    this.props.navigation.dispatch(
                        NavigationActions.navigate({
                            routeName: 'Home',
                            key: `home_${response.user_id}`
                        })
                    );

                    return;
                }

                this.setState({
                    isSubmitting: false
                });
            })
            .catch((error) => {
                this.refs.SnackBar.show(error[0]);

                setTimeout(() => {
                    this.setState({
                        isSubmitting: false
                    });
                }, 2000);
            })
    }

    render() {
        let isDisabled = true, buttonLoading;
        if (this.state.data.username && this.state.data.password) {
            isDisabled = false;
        }

        if (this.state.isSubmitting) {
            isDisabled = true;
            buttonLoading = <ActivityIndicator color="white"
                                               style={{ marginRight: 10 }}/>;
        }

        return (
            <View style={styles.container}>
                {this._doRenderField('username', 'Username or Email')}
                {this._doRenderField('password', 'Password')}
                <Button text="LOGIN"
                        disabled={isDisabled}
                        textProps={{ style: styles.buttonText }}
                        onPress={() => this._doLogin()}
                        iconView={buttonLoading}
                        style={[styles.submit, {opacity: isDisabled ? 0.4 : 1}]}/>
                <SnackBar text="" ref="SnackBar" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
         flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
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