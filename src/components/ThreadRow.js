import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import moment from 'moment';
import UserName from "./UserName";
import {Style} from "../Style";

export const ThreadRowSeparator = () => <View style={styles.separator} />;

export default class ThreadRow extends React.PureComponent {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        creatorUserId: PropTypes.number.isRequired,
        creatorName: PropTypes.string.isRequired,
        createdDate: PropTypes.number.isRequired,
        creatorAvatar: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        routeName: PropTypes.string.isRequired,
        rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        message: PropTypes.string
    };

    _onItemPress = () => {
        const { navigation, rowId, title, routeName } = this.props;
        navigation.dispatch(
            NavigationActions.navigate({
                routeName: routeName,
                key: `${routeName}_${rowId}`,
                params: {
                    threadId: rowId,
                    title: title
                }
            })
        );
    };

    _doRenderPreview = () => {
        const {message} = this.props;
        if (!message) {
            return null;
        }

        const messageTrimed =
            (message.length > 150) ? `${message.substr(0, 150)}...` : message;

        return <Text style={styles.bodyText}>{messageTrimed}</Text>;
    };

    _doRenderMeta = () => {
        const {creatorName, creatorUserId, createdDate, navigation} = this.props;
        const style = {
            container: {
                paddingTop: 10,
                flexDirection: 'row'
            },
            text: {
                ...Style.metaText,
                marginRight: 10
            }
        };

        return (
            <View style={style.container}>
                <UserName userId={creatorUserId} name={creatorName} navigation={navigation}/>
                <Text style={style.text}>
                    {moment(createdDate * 1000).fromNow()}
                </Text>
            </View>
        );
    };

    render() {
        const {title, creatorAvatar} = this.props;

        return (
            <TouchableHighlight onPress={this._onItemPress}>
                <View style={styles.container}>
                    <Avatar uri={creatorAvatar} />
                    <View style={styles.body}>
                        <Text style={styles.title} numberOfLines={3}>{title}</Text>
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
