import React from 'react'
import {TouchableHighlight, View, Text} from 'react-native'
import Avatar from "../../components/Avatar";
import HTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {NotificationStyle, Style} from "../../Style";

type Props = {
    avatarUri: String,
    notificationDate: Number,
    content: String,
    onPress: Function,
    isUnread?: boolean
};
export default class NotificationItem extends React.PureComponent<Props> {
    render() {
        const {onPress, avatarUri, content, notificationDate, isUnread} = this.props;

        const htmlProps = {
            baseFontStyle: {
                fontSize: 18
            },
            tagsStyles: {
                a: {
                    textDecorationLine: 'none',
                    flexWrap: 'wrap'
                }
            }
        };

        const rowStyles = [NotificationStyle.item];
        if (isUnread) {
            rowStyles.push(NotificationStyle.itemUnread);
        }

        return (
            <TouchableHighlight onPress={onPress}>
                <View style={rowStyles}>
                    <Avatar uri={avatarUri} size={NotificationStyle.avatarSize}/>
                    <View style={NotificationStyle.itemMain}>
                        <HTML html={content} {...htmlProps} />

                        <View style={NotificationStyle.metaRow}>
                            <Icon name={'clock'} size={14} color={'#8c8c8c'}/>
                            <Text style={Style.metaText}>{moment(notificationDate * 1000).fromNow()}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}