import React from 'react'
import {FlatList, Dimensions, Share, Platform} from 'react-native'
import PostCard, {PostCardSeparator} from "../../components/PostCard";
import {BASE_URL} from "../../Config";
import PostApi from "../../api/PostApi";

type Props = {
    posts: Array,
    navigation: Object
};
export default class PostList extends React.Component<Props> {
    _keyExtractor = (item) => JSON.stringify(item.post_id);
    _renderItem = ({item}) => <PostCard
        isLiked={item.post_is_liked}
        message={item.post_body_html}
        navigation={this.props.navigation}
        postedDate={item.post_create_date}
        posterAvatar={item.links.poster_avatar}
        posterName={item.poster_username}
        posterUserId={item.poster_user_id}
        onShare={() => this._onShare(item)}
        onLike={(isLiked, onSuccess, onFailure) => this._onLike(item, isLiked, onSuccess, onFailure)}
    />;

    _onShare = (post) => {
        const content = {
            title: 'Share this post',
            message: post.post_body_html
        };
        if (Platform.OS === 'ios') {
            content.url = `${BASE_URL}/posts/${post.post_id}`;
        }

        const options = Platform.select({
            ios: {
            },
            android: {
                dialogTitle: 'Share this post'
            }
        });

        Share.share(content, options);
    };
    _onLike = (item, isLiked, onSuccess, onFailure) => {
        if (isLiked) {
            PostApi.unlike(item.post_id)
                .then(onSuccess)
                .catch(onFailure);
        } else {
            PostApi.like(item.post_id)
                .then(onSuccess)
                .catch(onFailure);
        }
    };

    render() {
        const {posts} = this.props;
        return (
            <FlatList
                renderItem={this._renderItem}
                data={posts}
                initialNumToRender={3}
                keyExtractor={this._keyExtractor}
                numColumns={1}
                maxToRenderPerBatch={3}
                updateCellsBatchingPeriod={3}
                windowSize={Dimensions.get('window').width}
                ItemSeparatorComponent={PostCardSeparator}
                {...this.props}
            />
        );
    }
}