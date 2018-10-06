import React from "react"
import {View, Text, FlatList} from "react-native"
import BaseScreen, {LoadingState} from "./BaseScreen";
import {fetcher} from "../utils/Fetcher";
import PropTypes from "prop-types"
import PageNav from "../components/PageNav";
import PostCard, {PostCardSeparator} from "../components/PostCard";
import ReplyBox from "../components/ReplyBox";

export default class ThreadDetailScreen extends BaseScreen {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    static navigationOptions = ({navigation}) => {
        const threadTitle = navigation.getParam('title');

        return {
            title: threadTitle
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            showPageNav: false
        };
    }

    _doRenderItem(item) {
        return <PostCard post={item}/>;
    }

    _gotoPage(link, page) {
    }

    _doRenderPageNav() {
        if (!this.state.showPageNav || !this.state.links) {
            return null;
        }

        return <PageNav links={this.state.links}
                        gotoPage={(link, page) => this._gotoPage(link, page)}/>
    }

    _doReply(message) {
        this.refs.ReplyBox.clear();
    }

    _doRenderReplyBox() {
        return <ReplyBox ref="ReplyBox" onSubmit={(message) => this._doReply(message)}/>
    }

    _doRender() {
        return (
            <View style={{ flex: 1, paddingBottom: 60 }}>
                <FlatList renderItem={({item}) => this._doRenderItem(item)}
                          data={this.state.posts}
                          ItemSeparatorComponent={() => PostCardSeparator()}
                          keyExtractor={(item, index) => JSON.stringify(item.post_id)}
                          maxToRenderPerBatch={4}/>
                {this._doRenderPageNav()}
                {this._doRenderReplyBox()}
            </View>
        );
    }

    componentDidMount() {
        const threadId = this.props.navigation.getParam('threadId');
        if (!threadId) {
            throw new Error('Must be pass threadId into navigation params!');
        }

        const batchParams = [
            {
                uri: `threads/${threadId}`,
                method: 'GET'
            },
            {
                uri: 'posts',
                method: 'GET',
                params: {
                    thread_id: threadId
                }
            }
        ];

        fetcher.post('batch', { body: JSON.stringify(batchParams) })
            .then((response) => {
                this._setLoadingState(LoadingState.Done);

                this.setState({
                    thread: response.jobs[`threads/${threadId}`].thread,
                    posts: response.jobs.posts.posts,
                    links: response.jobs.posts.links
                });
            })
            .catch((error) => {
                this._setLoadingState(LoadingState.Error);
            });
    }
}