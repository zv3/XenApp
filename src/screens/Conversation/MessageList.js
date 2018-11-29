import React from 'react'
import {} from 'react-native'
import {PostCardSeparator} from "../../components/PostCard";
import {FlatList} from "react-native";
import PostCard from "../../components/PostCard";
import ConversationApi from "../../api/ConversationApi";

type Props = {
    messages: Array,
    navigation: Object
};
export default class MessageList extends React.PureComponent<Props> {
    _renderItem = ({item}) => {
        return <PostCard
            isLiked={item.message_is_liked}
            canLike={item.permissions.like}
            message={item.message_body_html}
            onLike={(isLiked, onSuccess, onFailure) => this._onLike(item, isLiked, onSuccess, onFailure)}
            postedDate={item.message_create_date}
            posterAvatar={item.links.creator_avatar}
            posterName={item.creator_username}
            posterUserId={item.creator_user_id}
            navigation={this.props.navigation}
        />;
    };

    _onLike = (item, isLiked, onSuccess, onFailure) => {
        if (isLiked) {
            ConversationApi.unlikeMessage(item.message_id)
                .then(onSuccess)
                .catch(onFailure);
        } else {
            ConversationApi.likeMessage(item.message_id)
                .then(onSuccess)
                .catch(onFailure);
        }
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