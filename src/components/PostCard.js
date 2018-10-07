import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { ButtonIcon } from './Button';
import Renderer from './../bbcode/Renderer';

export const PostCardSeparator = () => {
    return <View style={styles.separator} />;
};

export default class PostCard extends React.Component {
    static propTypes = {
        post: PropTypes.object.isRequired
    };

    _doRenderHeader() {
        const post = this.props.post;

        return (
            <View style={styles.header}>
                <Image
                    source={{ uri: post.links.poster_avatar }}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.user}>{post.poster_username}</Text>
                    <Text>{post.post_create_date}</Text>
                </View>
            </View>
        );
    }

    _doRenderBody() {
        const post = this.props.post;
        return (
            <View style={styles.body}>
                <Renderer content={post.post_body}/>
            </View>
        );
    }

    _doRenderFooter() {
        const post = this.props.post;

        const textProps = {
            style: {
                fontSize: 16
            }
        };

        const renderButton = (icon, text, disabled = false) => {
            return (
                <ButtonIcon
                    iconName={icon}
                    text={text}
                    iconSize={18}
                    disabled={disabled}
                    style={styles.footerButton}
                    textProps={textProps}
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
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d8',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    footerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        resizeMode: 'contain',
        marginRight: 10
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
    }
});
