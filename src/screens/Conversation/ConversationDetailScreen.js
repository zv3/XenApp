import React from 'react';
import {SafeAreaView, FlatList, View} from 'react-native'
import BaseScreen, {LoadingState} from "../BaseScreen";
import BatchApi from "../../api/BatchApi";
import {Style} from "../../Style";
import PageNav from "../../components/PageNav";
import PostCard, {PostCardSeparator} from "../../components/PostCard";

export default class ConversationDetailScreen extends BaseScreen {
    static navigationOptions = ({navigation}) => {
        const convoTitle = navigation.getParam('title');

        return {
            title: convoTitle
        };
    };

    _gotoPage = () => {};

    _renderItem = ({item}) => {
        return <PostCard
            isLiked={false}
            message={item.message_body_html}
            onLike={null}
            postedDate={item.message_create_date}
            posterAvatar={item.links.creator_avatar}
            posterName={item.creator_username}
            navigation={this.props.navigation}
        />
    };

    constructor(props) {
        super(props);

        this._pageNav = null;
    }

    componentDidMount(): void {
        const convoId = this.props.navigation.getParam('id');
        if (!convoId) {
            throw new Error('Must be pass id into navigation params!');
        }

        BatchApi.addRequest('get', `conversations/${convoId}`);
        BatchApi.addRequest('get', 'conversation-messages', {
            conversation_id: convoId
        });

        BatchApi.dispatch()
            .then((response) => {
                const conversation = response[`conversations/${convoId}`];
                const messages = response['conversation-messages'].messages;
                const links = response['conversation-messages'].links;

                this._setLoadingState(LoadingState.Done, { conversation, messages, links });
            })
            .catch(() => this._setLoadingState(LoadingState.Error));
    }

    _doRender() {
        const {links, messages} = this.state;
        return (
            <SafeAreaView style={Style.container}>
                <View>
                    <FlatList
                        renderItem={this._renderItem}
                        data={messages}
                        initialNumToRender={3}
                        keyExtractor={(item) => JSON.stringify(item.message_id)}
                        ItemSeparatorComponent={PostCardSeparator}
                        numColumns={1}
                        maxToRenderPerBatch={3}
                    />
                </View>
                {links && <PageNav
                    ref={(c) => this._pageNav = c}
                    links={links}
                    gotoPage={this._gotoPage}/>}
            </SafeAreaView>
        );
    }
}