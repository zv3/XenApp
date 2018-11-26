import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import moment from 'moment';

export const ThreadRowSeparator = () => <View style={styles.separator} />;

export default class ThreadRow extends React.Component {
    static propTypes = {
        thread: PropTypes.object.isRequired,
        navigation: PropTypes.object.isRequired
    };

    _onItemPress = () => {
        const { navigation, thread } = this.props;
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
    };

    _doRenderPreview = () => {
        const thread = this.props.thread;
        let message = thread.first_post.post_body_plain_text;

        if (message.length > 150) {
            message = `${message.substr(0, 150)}...`;
        }

        return <Text style={styles.bodyText}>{message}</Text>;
    };

    _doRenderMeta = () => {
        const thread = this.props.thread;
        const style = {
            container: {
                paddingTop: 10,
                flexDirection: 'row'
            },
            text: {
                fontSize: 14,
                color: '#8c8c8c',
                marginRight: 10
            }
        };

        return (
            <View style={style.container}>
                <Text style={style.text}>{thread.creator_username}</Text>
                <Text style={style.text}>
                    {moment(thread.thread_create_date * 1000).fromNow()}
                </Text>
            </View>
        );
    };

    render() {
        const thread = this.props.thread;

        return (
            <TouchableHighlight onPress={this._onItemPress}>
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
        flex: 1,
        marginLeft: 10
    },

    bodyText: {
        fontSize: 16,
        flexWrap: 'wrap',
        color: '#505050'
    },

    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#e7e7e7'
    }
});
