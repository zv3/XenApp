import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Avatar from './Avatar';

export const ThreadRowSeparator = () => <View style={styles.separator} />;

export default class ThreadRow extends React.Component {
    static propTypes = {
        thread: PropTypes.object.isRequired,
        navigation: PropTypes.object.isRequired
    };

    _doRenderPreview() {
        const thread = this.props.thread;
        let message = thread.first_post.post_body_plain_text;

        if (message.length > 150) {
            message = `${message.substr(0, 150)}...`;
        }

        return <Text style={styles.bodyText}>{message}</Text>;
    }

    _doRenderMeta() {
        const thread = this.props.thread;
        const style = {
            container: {
                paddingTop: 10,
                text: {
                    fontSize: 14,
                    color: '#8c8c8c'
                }
            }
        };

        return (
            <View style={style.container}>
                <Text style={style.text}>{thread.creator_username}</Text>
            </View>
        );
    }

    _onItemPress() {
        this.props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: 'ThreadDetail',
                key: `thread_${this.props.thread.thread_id}`,
                params: {
                    threadId: this.props.thread.thread_id,
                    title: this.props.thread.thread_title
                }
            })
        );
    }

    render() {
        const thread = this.props.thread;

        return (
            <TouchableHighlight
                onPress={() => this._onItemPress()}
                underlayColor="red">
                <View style={styles.container}>
                    <Avatar uri={thread.links.first_poster_avatar} />
                    <View style={styles.body}>
                        <Text style={styles.title} numberOfLines={3}>
                            {thread.thread_title}
                        </Text>
                        {this._doRenderPreview()}
                        {this._doRenderMeta()}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2577b1'
    },

    body: {
        width: 0,
        flexGrow: 1,
        flex: 1
    },

    bodyText: {
        fontSize: 14,
        flexWrap: 'wrap',
        color: '#505050'
    },

    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#e7e7e7'
    }
});
