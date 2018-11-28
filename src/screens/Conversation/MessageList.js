import React from 'react'
import {} from 'react-native'
import {PostCardSeparator} from "../../components/PostCard";
import {FlatList} from "react-native";
import PostCard from "../../components/PostCard";

type Props = {
    messages: Array,
    navigation: Object
};
export default class MessageList extends React.PureComponent<Props> {
    _renderItem = ({item}) => {
        return <PostCard
            isLiked={false}
            message={item.message_body_html}
            onLike={null}
            postedDate={item.message_create_date}
            posterAvatar={item.links.creator_avatar}
            posterName={item.creator_username}
            posterUserId={item.creator_user_id}
            navigation={this.props.navigation}
        />;
    };

    _keyExtractor = (item) => JSON.stringify(item.message_id);

    render() {
        const {messages} = this.props;

        return (
            <FlatList
                renderItem={this._renderItem}
                data={messages}
                initialNumToRender={3}
                keyExtractor={this._keyExtractor}
                ItemSeparatorComponent={PostCardSeparator}
                numColumns={1}
                maxToRenderPerBatch={3}
                {...this.props}
            />
        );
    }
}