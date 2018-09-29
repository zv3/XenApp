import React from "react"
import {View, StyleSheet, Image, Text, TouchableWithoutFeedback} from "react-native"
import PropTypes from "prop-types"

import {style} from "../Style"
import {ButtonIcon} from "./Button";
import {Config} from "../Config";
import DateRelative from "./DateRelative"
import {NavigationActions} from "react-navigation"

export const ACTION_TYPE = {
    LIKE: 'like',
    REPLY: 'reply',
    SHARE: 'share'
};

class Card extends React.Component {
    render() {
        const defaultStyle = {
            padding: 10,
            backgroundColor: '#FFF',
            flex: 1
        };

        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={[defaultStyle, this.props.style]}>
                    {this.props.header}
                    {this.props.body}
                    {this.props.footer}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
Card.propTypes = {
    header: PropTypes.object,
    body: PropTypes.object,
    footer: PropTypes.object,
    onPress: PropTypes.func
};
Card.defaultProps = {
    onPress: () => {}
};

class CardSeparator extends React.Component {
    render() {
        return (
            <View style={{ width:"100%", backgroundColor: 'rgb(245,245,245)', height: 10 }}/>
        );
    }
}

class ItemActions extends React.Component {
    _onItemPressed(type) {
        if (this.props.onItemPressed) {
            this.props.onItemPressed(type);
        }
    }

    render() {
        let buttonLike, buttonComment, buttonShare;
        buttonLike = (<ButtonIcon iconName="thumbs-up" text="Like"
                                  iconSize={18}
                                  type={this.props.isLiked ? 'highlighted' : 'default'}
                                  disabled={!this.props.canLike}
                                  style={{ backgroundColor: 'transparent' }}
                                  onPress={() => this._onItemPressed(ACTION_TYPE.LIKE)}/>);

        if (this.props.canComment) {
            buttonComment = (<ButtonIcon iconName="message-square"
                                         text="Reply"
                                         iconSize={18}
                                         onPress={() => this._onItemPressed(ACTION_TYPE.REPLY)} />);
        }

        buttonShare = (<ButtonIcon iconName="share"
                                   text="Share"
                                   iconSize={18}
                                   onPress={() => this._onItemPressed(ACTION_TYPE.SHARE)} />);

        if (!buttonLike && !buttonComment && !buttonShare) {
            return null;
        }

        return (
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                {buttonLike}
                {buttonComment}
                {buttonShare}
            </View>
        );
    }
}

ItemActions.propTypes = {
    canLike: PropTypes.bool,
    isLiked: PropTypes.bool,

    canComment: PropTypes.bool,
    canShare: PropTypes.bool,
    onItemPressed: PropTypes.func
};

class ThreadCard extends React.Component {
    _onPressed() {
        this.props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: Config.Constants.SCREEN_THREAD_DETAIL,
                key: `thread_${this.props.thread.thread_id}`,
                params: {
                    thread: this.props.thread
                }
            })
        );
    }

    _onAction(type) {}

    render() {
        const thread = this.props.thread,
            post = thread.first_post;

        return <PostCard
                        onPress={() => this._onPressed()}
                        post={post}
                        thread={thread}
                        onAction={(type) => this._onAction(type)}
                        showFullText={false} />;
    }
}
ThreadCard.propTypes = {
    thread: PropTypes.object,
    navigation: PropTypes.object.isRequired
};

class PostCard extends React.Component {
    _doRenderHeader() {
        const post = this.props.post;

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: post.links.poster_avatar }}
                       style={style.avatar.circle} />
                <View style={{ paddingLeft: 10 }}>
                    <Text style={[style.link.default, {fontWeight: 'bold'}]}>{post.poster_username}</Text>
                    <DateRelative date={post.post_create_date}/>
                </View>
            </View>
        );
    }

    _doRenderFooter() {
        const post = this.props.post;
        const style = {
            divider: {
                height: 0.5,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.1)',
                marginTop: 10
            }
        };
        return (
            <View>
                <View style={style.divider}/>
                <ItemActions canLike={post.permissions.like}
                             isLiked={post.post_is_liked}
                             canComment={post.permissions.reply}
                             onItemPressed={(type) => this.props.onAction(type, this.props.post)}
                             canShare={false}/>
            </View>
        );
    }

    _doRenderBody() {
        const threadTitleStyle = {
            marginBottom: 10,
            fontWeight: 'bold'
        };

        const wordTrim = (string) => {
            return (string.length > Config.previewMessageLength)
                ? `${string.substr(0, Config.previewMessageLength)}...`
                : string;
        };

        const thread = this.props.thread,
              post = this.props.post,
              postBodyText = this.props.showFullText
                  ? post.post_body_plain_text
                  : wordTrim(post.post_body_plain_text);

        let threadTitle;
        if (thread && post.post_is_first_post) {
            threadTitle = (<Text style={[style.link.default, threadTitleStyle]}>{thread.thread_title}</Text>);
        }

        return (
            <View style={{ flex: 1, marginTop: 10}}>
                {threadTitle}
                <Text style={{ fontSize: 18 }}>{postBodyText}</Text>
            </View>
        );
    }

    render() {
        return (
            <Card {...this.props}
                header={this._doRenderHeader()}
                body={this._doRenderBody()}
                footer={this._doRenderFooter()}
                style={{ paddingBottom: 0 }}/>
        );
    }
}
PostCard.propTypes = {
    post: PropTypes.object.isRequired,
    thread: PropTypes.object,
    showFullText: PropTypes.bool,
    onAction: PropTypes.func.isRequired
};
PostCard.defaultProps = {
    showFullText: true
};

export {
    Card,
    CardSeparator,
    ThreadCard,
    PostCard
}