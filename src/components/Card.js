import React from "react"
import {View, StyleSheet, Image, Text} from "react-native"
import PropTypes from "prop-types"

import {style} from "../Style"
import ButtonIcon from "../ButtonIcon";
import {Config} from "../Config";


class Card extends React.Component {
    render() {
        const defaultStyle = {
            padding: 10,
            backgroundColor: '#FFF',
            flex: 1
        };

        return (
            <View style={[defaultStyle, this.props.style]}>
                {this.props.header}
                {this.props.body}
                {this.props.footer}
            </View>
        );
    }
}
Card.propTypes = {
    header: PropTypes.object,
    body: PropTypes.object,
    footer: PropTypes.object
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
            <View style={{ flexDirection: 'row', flex: 1 }}>
                {buttonLike}
                {buttonComment}
                {buttonShare}
            </View>
        );
    }
}

ItemActions.propTypes = {
    canLike: PropTypes.bool,
    canComment: PropTypes.bool,
    canShare: PropTypes.bool
};

class ThreadCard extends React.Component {
    _doRenderHeader() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: this.props.thread.links.first_poster_avatar }}
                       style={style.avatar.circle} />
                <View style={{ paddingLeft: 10 }}>
                    <Text style={[style.link.default, {fontWeight: 'bold'}]}>{this.props.thread.creator_username}</Text>
                </View>
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

        return (
            <View style={{ paddingTop: 10 }}>
                <Text style={[style.link.default, threadTitleStyle]}>{this.props.thread.thread_title}</Text>

                <Text style={{ fontSize: 13 }}>{wordTrim(this.props.thread.first_post.post_body_plain_text)}</Text>
            </View>
        );
    }

    _doRenderFooter() {
        const thread = this.props.thread;
        const style = {
            divider: {
                height: 0.5,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.1)',
                marginTop: 10,
                marginBottom: 10
            }
        };
        return (
            <View>
                <View style={style.divider}/>
                <ItemActions canLike={thread.first_post.permissions.like}
                             canComment={thread.first_post.permissions.reply}
                             canShare={true}/>
            </View>
        );
    }

    render() {
        return (<Card header={this._doRenderHeader()}
                      body={this._doRenderBody()}
                      footer={this._doRenderFooter()}/>);
    }
}
ThreadCard.propTypes = {
    thread: PropTypes.object
};

export {
    Card,
    ThreadCard
}