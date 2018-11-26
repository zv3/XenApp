import React from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    SafeAreaView,
    Alert
} from 'react-native';
import ButtonIcon from '../components/ButtonIcon';
import PropTypes from 'prop-types';
import ThreadApi from '../api/ThreadApi';
import { NavigationActions } from 'react-navigation';

export default class ThreadCreateScreen extends React.Component {
    static navigationOptions = () => {
        return {
            title: 'Create new thread'
        };
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    _doRenderTextField = (name, label, props) => {
        const style = [styles.input];
        if (props.hasOwnProperty('style')) {
            style.push(props.style);
            delete props.style;
        }

        return (
            <TextInput
                editable={!this.state.isSubmitting}
                style={style}
                placeholder={label}
                autoCorrect={false}
                onChangeText={(text) => this._setFieldValue(name, text)}
                {...props}
            />
        );
    };

    _setFieldValue = (name, value) => {
        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                [name]: value
            }
        }));
    };

    _doSubmit = () => {
        this.setState({ isSubmitting: true });

        const { navigation } = this.props;
        const forum = navigation.getParam('forum');

        const { title, body } = this.state.fields;

        ThreadApi.create(forum.forum_id, title, body)
            .then((response) => {
                const { thread } = response;

                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'ThreadDetail',
                        key: `thread_${thread.thread_id}`,
                        params: {
                            threadId: thread.thread_id,
                            title: thread.thread_title
                        }
                    })
                );
            })
            .catch((err) => {
                Alert.alert('Whoops!', err.toString());

                this.setState({ isSubmitting: false });
            });
    };

    constructor(props) {
        super(props);

        this.state = {
            fields: {
                title: '',
                body: ''
            },
            isSubmitting: false
        };
    }

    render() {
        const { navigation } = this.props;
        const forum = navigation.getParam('forum');

        const contentProps = {
            numberOfLines: 15,
            multiline: true,
            style: {
                // flexGrow: 1
                height: 150
            }
        };

        const submitStyles = [styles.submit];
        const flex = { flex: 1 };

        return (
            <SafeAreaView style={flex}>
                <View style={styles.container}>
                    <View>
                        <Text style={styles.heading}>
                            In forum:{' '}
                            <Text style={styles.forumTitle}>
                                {forum.forum_title}
                            </Text>
                        </Text>

                        {this._doRenderTextField('title', 'Thread Title', {
                            maxLength: 100
                        })}

                        {this._doRenderTextField(
                            'body',
                            'Content',
                            contentProps
                        )}
                    </View>

                    {/*<Button title="Attach files" onPress={this._doAttachFiles} />*/}

                    <ButtonIcon
                        iconName={'save'}
                        iconColor={'#FFF'}
                        textColor={'#FFF'}
                        title="Save"
                        onPress={this._doSubmit}
                        style={submitStyles}
                    />
                </View>
            </SafeAreaView>
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

        fontSize: 18,
        backgroundColor: '#FFF',

        borderRadius: 4
    },

    heading: {
        fontSize: 18,
        marginBottom: 20
    },

    forumTitle: {
        fontWeight: 'bold'
    },

    submit: {
        backgroundColor: '#ff4081',
        width: '100%',
        // padding: 5,
        borderRadius: 4,
        marginTop: 10
    }
});
