import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import ButtonIcon from './ButtonIcon';
import HTML from 'react-native-render-html';
import moment from 'moment';
import Avatar from './Avatar';
import UserName from './UserName';
import { Style } from '../Style';

const { width } = Dimensions.get('window');

export const PostCardSeparator = () => <View style={styles.separator} />;

type Props = {
    posterAvatar: ?PropTypes.string,

    posterUserId: PropTypes.number,
    posterName: PropTypes.string,

    postedDate: PropTypes.number,
    message: PropTypes.string,

    onShare?: ?PropTypes.func,
    onLike?: ?PropTypes.func,

    isLiked: PropTypes.bool,
    navigation: PropTypes.object
};
export default class PostCard extends React.PureComponent<Props> {
    state = {
        isLiked: null
    };

    static getDerivedStateFromProps(nextProps: Props, state) {
        if (state.isLiked === null) {
            return { isLiked: nextProps.isLiked };
        }

        return null;
    }

    _doRenderHeader = () => {
        const {
            posterAvatar,
            posterName,
            postedDate,
            posterUserId,
            navigation
        } = this.props;

        return (
            <View style={styles.header}>
                <Avatar uri={posterAvatar} style={styles.avatar} />
                <View>
                    <UserName
                        userId={posterUserId}
                        name={posterName}
                        navigation={navigation}
                        userStyle={styles.user}
                    />
                    <Text style={Style.metaText}>
                        {moment(postedDate * 1000).fromNow()}
                    </Text>
                </View>
            </View>
        );
    };

    _doRenderBody = () => {
        const { message } = this.props;
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

                if (attribs && attribs.class) {
                    const classList = attribs.class.split(' ');
                    if (classList.indexOf('bbCodeBlock') !== -1) {
                        node.attribs = Object.assign(attribs, {
                            style: quoteStyle.join(';')
                        });

                        return node;
                    }
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
            },
            imagesMaxWidth: width - styles.body.padding * 2
        };

        return (
            <View style={styles.body}>
                <HTML html={message} {...htmlConfig} />
            </View>
        );
    };

    _onActionPressed = (icon) => {
        const { onShare, onLike } = this.props;

        switch (icon) {
            case 'thumbs-up':
                {
                    const { isLiked } = this.state;
                    const onSuccess = () =>
                        this.setState({ isLiked: !isLiked });
                    const onFailure = () => {
                        /** Do nothing */
                    };

                    onLike(isLiked, onSuccess, onFailure);
                }
                break;
            case 'share':
                {
                    onShare();
                }
                break;
            default:
                throw new Error(`Unknown action pressed: ${icon}`);
        }
    };

    _doRenderFooter = () => {
        const { onShare, onLike } = this.props;

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
                    onPress={() => this._onActionPressed(icon)}
                />
            );
        };

        return (
            <View style={styles.footer}>
                {onLike &&
                    renderButton(
                        'thumbs-up',
                        this.state.isLiked ? 'Unlike' : 'Like'
                    )}
                {onShare && renderButton('share', 'Share')}
            </View>
        );
    };

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
        marginBottom: 10,
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
