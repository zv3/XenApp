import React from 'react';
import {
    View, Text, StyleSheet, Image
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Feather';
import ButtonIcon from './ButtonIcon'

const style = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: 'white',
       padding: 10
   },
    avatar: {
       width: 40,
        height: 40,
        resizeMode: 'contain',
        borderRadius: 20
    },

    creator: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#2577b1'
    },

    textMeta: {
       fontSize: 11,
        marginLeft: 5,
        color: 'rgb(140, 140, 140)'
    },

    divider: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginTop: 10,
        marginBottom: 10
    },

    threadTitle: {
        marginBottom: 10,
        fontSize: 13,
        fontWeight: 'bold',
        color: '#2577b1'
    }
});

class TextMeta extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name={this.props.icon} size={11} color="rgb(140, 140, 140)" />
                <Text style={style.textMeta}>{this.props.text}</Text>
            </View>
        );
    }
}
TextMeta.propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string
};

class ItemActions extends React.Component {
    _likeItem() {
        console.log(22)
    }

    _onCommentPressed() {

    }

    _onSharePressed() {

    }

    render() {
        let buttonLike, buttonComment, buttonShare;
        if (this.props.canLike) {
            buttonLike = (<ButtonIcon iconName="thumbs-up" text="Like"
                                      iconSize={15}
                                      iconColor="#8c8c8c"
                                      onPress={() => this._likeItem()}
                                      textStyle={{ fontSize: 14, color: '#8c8c8c' }} />);
        }

        if (this.props.canComment) {
            buttonComment = (<ButtonIcon iconName="message-square"
                                         text="Comment"
                                         iconSize={15}
                                         iconColor="#8c8c8c"
                                         onPress={() => this._onCommentPressed()}
                                         textStyle={{ fontSize: 14, color: '#8c8c8c' }} />);
        }

        if (this.props.canShare) {
            buttonShare = (<ButtonIcon iconName="share"
                                       text="Share"
                                       iconSize={15}
                                       iconColor="#8c8c8c"
                                       onPress={() => this._onCommentPressed()}
                                       textStyle={{ fontSize: 14, color: '#8c8c8c' }} />);
        }

        return (
            <View>
                <View style={style.divider}></View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    {buttonLike}
                    {buttonComment}
                    {buttonShare}
                </View>
            </View>
        );
    }
}

ItemActions.propTypes = {
    canLike: PropTypes.bool,
    canComment: PropTypes.bool,
    canShare: PropTypes.bool
};

ItemActions.defaultProps = {
    canLike: false,
    canComment: false,
    canShare: false
};

export default class ThreadListItem extends React.Component {
    _wordTrimText(text) {
        return text.length > 200 ? `${text.substr(0, 200)}...` : text;
    }

    render() {
        const thread = this.props.thread;

        return (
            <View style={style.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: thread.links.first_poster_avatar }} style={style.avatar} />
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={style.creator}>{thread.creator_username}</Text>
                        <TextMeta icon="clock" text="Post Date"/>
                    </View>
                </View>
                <View style={{ paddingTop: 10 }}>
                    <Text style={style.threadTitle}>{thread.thread_title}</Text>

                    <Text style={{ fontSize: 13 }}>{this._wordTrimText(thread.first_post.post_body_plain_text)}</Text>
                </View>

                <ItemActions canLike={thread.first_post.permissions.like}
                             canComment={thread.first_post.permissions.reply}
                             canShare={true}/>
            </View>
        );
    }
}

ThreadListItem.propTypes = {
    thread: PropTypes.object
};