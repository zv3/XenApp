import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import ButtonIcon from './ButtonIcon';
import HTML from 'react-native-render-html';
import moment from 'moment';
import Avatar from './Avatar';

export const PostCardSeparator = () => <View style={styles.separator} />;

export default class PostCard extends React.Component {
    static propTypes = {
        post: PropTypes.object.isRequired
    };

    _doRenderHeader = () => {
        const post = this.props.post;

        return (
            <View style={styles.header}>
                <Avatar uri={post.links.poster_avatar} style={styles.avatar} />
                <View>
                    <Text style={styles.user}>{post.poster_username}</Text>
                    <Text>
                        {moment(post.post_create_date * 1000).fromNow()}
                    </Text>
                </View>
            </View>
        );
    };

    _doRenderBody = () => {
        const post = this.props.post;
        const quoteStyle = [];
        for (const key in styles.quoteBlock) {
            if (styles.quoteBlock.hasOwnProperty(key)) {
                quoteStyle.push(`${key}:${styles.quoteBlock[[key]]}`);
            }
        }

        const htmlConfig = {
            baseFontStyle: {
                fontSize: 18
            },
            ignoredTags: ['head', 'scripts', 'table'],
            alterNode: (node) => {
                const { attribs } = node;

                if (
                    attribs &&
                    attribs.class &&
                    attribs.class.indexOf('bbCodeBlock--quote') !== -1
                ) {
                    node.attribs = Object.assign(attribs, {
                        style: quoteStyle.join(';')
                    });

                    return node;
                }
            },
            alterData: (node) => {
                const { data, parent } = node;
                if (
                    parent &&
                    parent.attribs &&
                    parent.attribs.class &&
                    parent.attribs.class.indexOf('bbCodeBlock') !== -1
                ) {
                    return data.replace(/^\s*/, '');
                }
            }
        };

        return (
            <View style={styles.body}>
                <HTML html={post.post_body_html} {...htmlConfig} />
            </View>
        );
    };

    _onActionPressed = () => {};

    _doRenderFooter = () => {
        const { post } = this.props;

        const renderButton = (icon, text, disabled = false) => {
            const iconColor = Platform.select({
                ios: {
                    color: disabled ? '#cdcdcd' : '#007AFF'
                },
                android: {
                    color: disabled ? '#a1a1a1' : '#007AFF'
                }
            });

            return (
                <ButtonIcon
                    iconName={icon}
                    iconColor={iconColor.color}
                    title={text}
                    iconSize={18}
                    disabled={disabled}
                    onPress={this._onActionPressed}
                />
            );
        };

        return (
            <View style={styles.footer}>
                {renderButton('thumbs-up', 'Like', !post.permissions.like)}
                {renderButton(
                    'message-square',
                    'Reply',
                    !post.permissions.reply
                )}
                {renderButton('share', 'Share')}
            </View>
        );
    };

    shouldComponentUpdate(nextProps): boolean {
        return nextProps.post.post_id !== this.props.post.post_id;
    }

    render() {
        return (
            <View style={styles.container}>
                {this._doRenderHeader()}
                {this._doRenderBody()}
                {this._doRenderFooter()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d8',
        borderTopWidth: 1,
        borderTopColor: '#d8d8d8'
    },

    body: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d8'
    },

    footer: {
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    user: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2577b1'
    },

    separator: {
        width: '100%',
        height: 10,
        backgroundColor: '#ececec'
    },

    avatar: {
        marginRight: 10
    },
    quoteBlock: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#f2930d',
        borderTopWidth: 1,
        borderTopColor: '#dfdfdf',
        borderRightWidth: 1,
        borderRightColor: '#dfdfdf',
        borderBottomWidth: 1,
        borderBottomColor: '#dfdfdf'
    }
});
