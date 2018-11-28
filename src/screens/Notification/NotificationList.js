import React from 'react'
import {FlatList} from 'react-native'
import NotificationItem from "./NotificationItem";
import {ThreadRowSeparator} from "../../components/ThreadRow";
import {NavigationActions} from 'react-navigation';
import {Fetcher} from "../../utils/Fetcher";

type Props = {
    notifications: Array,
    navigation: Object
};
export default class NotificationList extends React.PureComponent<Props> {
    _keyExtractor = (item) => JSON.stringify(item.notification_id);
    _renderItem = ({item}) => <NotificationItem
        avatarUri={item.links.creator_avatar}
        notificationDate={item.notification_create_date}
        content={item.notification_html}
        onPress={() => this._onItemPress(item)}
        isUnread={item.notification_is_unread}
    />;

    _onItemPress = (item) => {
        const {navigation} = this.props;

        switch (item.content_type) {
            case 'post':
                Fetcher.get(item.links.content)
                    .then(() => {
                        // TODO: Go to target content
                    })
                    .catch(() => {});
                break;
            case 'thread':
                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'Thread',
                        key: `Thread_${item.content_id}`,
                        params: {
                            id: item.content_id
                        }
                    }));
                break;
        }
    };

    render() {
        const {notifications} = this.props;

        return (
            <FlatList
                renderItem={this._renderItem}
                data={notifications}
                initialNumToRender={3}
                keyExtractor={this._keyExtractor}
                numColumns={1}
                maxToRenderPerBatch={3}
                ItemSeparatorComponent={ThreadRowSeparator}
                {...this.props}
            />
        );
    }
}
