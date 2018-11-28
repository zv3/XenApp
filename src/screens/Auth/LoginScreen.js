import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Text
} from 'react-native';
import Button from '../../components/Button';
import { Token } from '../../utils/Token';
import PropTypes from 'prop-types';
import UserApi from '../../api/UserApi';
import AuthEvent from '../../events/AuthEvent';
import { Visitor } from '../../utils/Visitor';
import OAuthApi from '../../api/OAuthApi';

export default class LoginScreen extends React.Component {
    static navigationOptions = () => {
        return {
            title: 'Login'
        };
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    _doLogin = () => {
        this.setState({
            isSubmitting: true
        });

        const { username, password, code } = this.state.data;

        const onFailedLogin = () => {
            if (code && code.length > 0) {
                Alert.alert('Cannot verify', 'Invalid code provided');
            } else {
                Alert.alert('Cannot log-in', 'Invalid password or email');
            }

            setTimeout(() => {
                this.setState({
                    isSubmitting: false
                });
            }, 2000);
        };

        const tfa = {};
        const { tfaProvider } = this.state;
        if (tfaProvider) {
            tfa.code = code;

            if (tfaProvider === 'email') {
                tfa.tfa_trigger = 1;
                tfa.tfa_provider = 'email';
            } else {
                tfa.tfa_provider = 'totp';
            }
        }

        OAuthApi.login(username, password, tfa, { skipDefaultHandler: true })
            .then((response) => {
                const { data, status, headers } = response;

                if (status === 202) {
                    this.setState({
                        tfaProvider: headers['x-api-tfa-providers'],
                        isSubmitting: false
                    });
                } else if (
                    status === 200 &&
                    data.hasOwnProperty('access_token')
                ) {
                    UserApi.get('me', { oauth_token: data.access_token })
                        .then((user) => {
                            Token.saveToken(data);

                            this.props.navigation.navigate('Home');

                            Visitor.setVisitor(user);
                            AuthEvent.dispatch(user);
                        })
                        .catch(onFailedLogin);
                } else {
                    onFailedLogin();
                }
            })
            .catch(onFailedLogin);
    };

    constructor(props) {
        super(props);

        this.state = {
            data: {},
            isSubmitting: false,
            tfaProvider: ''
        };
    }

    _onChangeText(name, value) {
        this.setState((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                [name]: value
            }
        }));
    }

    _doRenderField(name, placeholder, props) {
        let secureTextEntry = false,
            keyboardType = 'default';
        if (name.indexOf('password') === 0) {
            secureTextEntry = true;
        }

        const { data, isSubmitting } = this.state;

        return (
            <TextInput
                editable={!isSubmitting}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                autoCapitalize={'none'}
                autoCorrect={false}
                keyboardType={keyboardType}
                onChangeText={(text) => this._onChangeText(name, text)}
                placeholder={placeholder}
                value={data[[name]]}
                {...props}
            />
        );
    }

    render() {
        const { data, isSubmitting, tfaProvider } = this.state;

        let formComponent;
        const wrap = {
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20
        };

        if (tfaProvider) {
            formComponent = (
                <View style={wrap}>
                    <Text style={styles.minorHeading}>
                        Two-step verification required
                    </Text>
                    {this._doRenderField('code', 'Verification code', {
                        keyboardType: 'number-pad',
                        autoFocus: true
                    })}
                    <Button
                        title={'Verify'}
                        disabled={
                            !data.username || !data.password || isSubmitting
                        }
                        onPress={this._doLogin}
                        style={styles.submit}
                        textStyle={styles.textStyle}>
                        {isSubmitting && <ActivityIndicator color="white" />}
                    </Button>
                </View>
            );
        } else {
            formComponent = (
                <View style={wrap}>
                    {this._doRenderField('username', 'Username or Email', {
                        autoFocus: true
                    })}

                    {this._doRenderField('password', 'Password')}

                    <Button
                        title="Login"
                        disabled={
                            !data.username || !data.password || isSubmitting
                        }
                        onPress={this._doLogin}
                        style={styles.submit}
                        textStyle={styles.textStyle}>
                        {isSubmitting && <ActivityIndicator color="white" />}
                    </Button>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={styles.heading}>XenApp</Text>

                {formComponent}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '30%'
    },

    heading: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: 'center'
    },

    minorHeading: {
        fontSize: 18,
        marginBottom: 10
    },

    input: {
        width: '100%',
        marginBottom: 10,
        padding: 10,
        fontSize: 18,
        backgroundColor: '#FFF',

        borderRadius: 4
    },

    submit: {
        backgroundColor: '#2577b1',
        width: 200,
        borderRadius: 3,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textStyle: {
        color: '#FFF'
    }
});
