import React from "react"
import {View, Text, StyleSheet, Image, TouchableHighlight} from "react-native"
import {NavigationActions} from "react-navigation"
import PropTypes from "prop-types"

export const ThreadRowSeparator = () => {
    return <View style={{ width: '100%', height: 1, backgroundColor: '#e7e7e7' }}/>;
};

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

        return <Text style={{ fontSize: 14, flexWrap: 'wrap', color: '#505050' }}>{message}</Text>;
    }

    _doRenderMeta() {
        const thread = this.props.thread;

        return (
            <View style={{ paddingTop: 10 }}>
                <Text style={{ fontSize: 14, color: '#8c8c8c' }}>{thread.creator_username}</Text>
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
            <TouchableHighlight onPress={() => this._onItemPress()} underlayColor="red">
                <View style={styles.container}>
                    <Image source={{ uri: thread.links.first_poster_avatar }} style={styles.avatar}/>
                    <View style={{ width: 0, flexGrow: 1, flex: 1 }}>
                        <Text style={styles.title} numberOfLines={3}>{thread.thread_title}</Text>
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
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        marginRight: 10,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2577b1'
    }
});