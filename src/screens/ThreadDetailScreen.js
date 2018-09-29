import React from "react";
import {ButtonIcon} from "../components/Button";
import {Config} from "../Config";
import {apiFetcher} from "../helpers/apiFetcher";
import PageNav from "../components/PageNav";
import {FlatList, View} from "react-native";
import {ACTION_TYPE, CardSeparator, PostCard} from "../components/Card";
import {LoadingSwitch} from "./LoadingScreen";
import ReplyBox, {REPLY_STATE} from "../components/ReplyBox";
import {handleDefaultErrors} from "../helpers/funcs";


class ThreadDetailScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const thread = navigation.getParam('thread');

        return {
            title: thread.thread_title,
            headerRight: (
                <ButtonIcon iconName="bookmark" style={{marginRight: 10}}/>
            )
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            loadingState: Config.Constants.LOADING_STATE_BEGIN,
            replyState: REPLY_STATE.NONE
        };

        this.quotePostId = 0;
    }

    _doLoadPosts(page = 1) {
        const thread = this.props.navigation.getParam('thread');

        this.setState({
            loadingState: Config.Constants.LOADING_STATE_BEGIN
        });

        apiFetcher.get('posts', {
            thread_id: thread.thread_id,
            page: page
        }, {
            onSuccess: (data) => {
                this.setState({
                    loadingState: Config.Constants.LOADING_STATE_DONE,
                    links: data.links,
                    posts: data.posts
                });
            },
            onError: () => {
                this.setState({ loadingState: Config.Constants.LOADING_STATE_FAILED });
            }
        });
    }

    componentDidMount() {
        this._doLoadPosts();
    }

    _gotoPage(page) {
        this._doLoadPosts(page);
    }

    _doReply(text) {
        const thread = this.props.navigation.getParam('thread');
        this.setState({ replyState: REPLY_STATE.SENDING });

        apiFetcher.post('posts', {
            thread_id: thread.thread_id,
            post_body: text
        }, {
            onSuccess: (data) => {
                this.setState(prevState => ({
                   ...prevState,
                   posts: [
                       ...prevState.posts,
                       data.post
                   ]
                }));

                this.refs.postList.scrollToEnd();
                this.refs.replyBox.clear();
            },
            onError: (errors) => {
                handleDefaultErrors(errors);

                setTimeout(() => {
                    this.setState({ replyState: REPLY_STATE.NONE });
                }, 2000);
            }
        });
    }

    _onAction(type, post) {
        if (type === ACTION_TYPE.REPLY) {
            // quote an post.
            this.quotePostId = post.post_id;
        }
    }

    render() {
        let finalView;
        if (this.state.loadingState === Config.Constants.LOADING_STATE_DONE) {
            let pageNav, replyBox;
            if (this.state.links) {
                pageNav = <PageNav maxPages={this.state.links.pages}
                                   currentPage={this.state.links.page}
                                   gotoPage={(page) => this._gotoPage(page)}/>;
            }

            replyBox = (<ReplyBox
                                ref="replyBox"
                                onReply={(text) => this._doReply(text)}
                                replyState={this.state.replyState}/>);

            finalView = (
                <View style={{ flex: 1 }}>
                    <FlatList data={this.state.posts}
                              ref="postList"
                              keyExtractor={(item, index) => JSON.stringify(item.post_id)}
                              ItemSeparatorComponent={() => <CardSeparator/>}
                              renderItem={({item}) => <PostCard post={item} onAction={(type, post) => this._onAction(type, post)}/>}/>

                    {pageNav}
                    {replyBox}
                </View>
            );
        }

        return <LoadingSwitch loadState={this.state.loadingState}
                              view={finalView}/>
    }
}

export default ThreadDetailScreen