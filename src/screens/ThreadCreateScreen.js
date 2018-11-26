import React from 'react';
import { View, StyleSheet, TextInput, Text, SafeAreaView } from 'react-native';
import ButtonIcon from '../components/ButtonIcon';
import PropTypes from 'prop-types'

export default class ThreadCreateScreen extends React.Component {
    static navigationOptions = () => {
        return {
            title: 'Create new thread'
        };
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired
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
        const style = [styles.input];
        if (props.hasOwnProperty('style')) {
            style.push(props.style);
            delete props.style;
        }

        return (
            <TextInput
                editable={true}
                style={style}
                placeholder={label}
                autoCorrect={false}
                multiline={true}
                onTextChange={(text) => this._setFieldValue(name, text)}
                {...props}
            />
        );
    }

    _doSubmit = () => {};

    render() {
        const {navigation} = this.props;
        const forum = navigation.getParam('forum');

        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{flexGrow:1}}>
                        <Text style={styles.heading}>In forum: <Text style={styles.forumTitle}>{forum.forum_title}</Text></Text>

                        {this._doRenderTextField('thread_title', 'Thread Title', {
                            maxLength: 100
                        })}

                        {this._doRenderTextField('thread_body', 'Content', {
                            numberOfLines: 15,
                            style: {
                                flexGrow: 1
                            }
                        })}
                    </View>

                    {/*<Button title="Attach files" onPress={this._doAttachFiles} />*/}

                    <ButtonIcon
                        iconName={'save'}
                        iconColor={'#FFF'}
                        textColor={'#FFF'}
                        title="Save"
                        onPress={this._doSubmit}
                        style={styles.submit}
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
