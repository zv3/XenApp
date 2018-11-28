import React from 'react'
import {FlatList} from 'react-native'
import ThreadRow, {ThreadRowSeparator} from "./ThreadRow";

type Props = {
    threads: Array,
    navigation: Object
};
export default class ThreadList extends React.PureComponent<Props> {
    _keyExtractor = (item) => JSON.stringify(item.thread_id);
    _renderItem = ({item}) => {
        const {navigation} = this.props;

        return <ThreadRow
            creatorUserId={item.creator_user_id}
            creatorName={item.creator_username}
            createdDate={item.thread_create_date}
            creatorAvatar={item.links.first_poster_avatar}
            title={item.thread_title}
            routeName={'ThreadDetail'}
            rowId={item.thread_id}
            navigation={navigation}
            message={item.first_post.post_body_plain_text}
        />;
    };

    render() {
        const {threads} = this.props;
        return (
            <FlatList
                renderItem={this._renderItem}
                data={threads}
                ItemSeparatorComponent={ThreadRowSeparator}
                keyExtractor={this._keyExtractor}
                {...this.props}
            />
        );
    }
}