import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Keyboard,
    Platform,
    Alert,
    LayoutAnimation
} from 'react-native';
import BaseScreen, { LoadingState } from '../BaseScreen';
import { Fetcher } from '../../utils/Fetcher';
import PropTypes from 'prop-types';
import PageNav from '../../components/PageNav';
import ReplyBox from '../../components/ReplyBox';
import PostApi from '../../api/PostApi';
import PostList from "./PostList";
import BatchApi from "../../api/BatchApi";

export default class ThreadDetailScreen extends BaseScreen {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    static navigationOptions = ({ navigation }) => {
        const threadTitle = navigation.getParam('title');

        return {
            title: threadTitle
        };
    };

    _doReply = (message) => {
        const {thread} = this.state;

        PostApi.create(thread.thread_id, message)
            .then((response) => {
                if (this._replyBox !== null) {
                    this._replyBox.clear();
                }

                const { post } = response;
                this.setState((prevState) => ({
                    ...prevState,
                    posts: [...prevState.posts, post]
                }));
            })
            .catch((err) => {
                Alert.alert('Whoops!', err.toString());
                this._replyBox.toggleEnabled(true);
            });
    };

    _gotoPage = (link, page) => {
        this._setLoadingState(LoadingState.Begin);

        Fetcher.get(link, { page: page })
            .then(this._onResponse)
            .catch(() => this._setLoadingState(LoadingState.Error));
    };

    _onResponse = (response, thread: ?Object) => {
        const {posts, links} = response;
        if (!thread) {
            thread = response.thread;
        }

        this._setLoadingState(LoadingState.Done, {posts, links, thread});
        this._togglePageShow(true);
    };

    _onKeyboardDidShown = (ev) => {
        const { endCoordinates } = ev;

        this._togglePageShow(false);
        let replyBoxHeight = 0;
        if (this._replyBox) {
            replyBoxHeight = this._replyBox.getLayoutHeight();
        }
        const maxViewHeight = this._viewHeight - endCoordinates.height - replyBoxHeight;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        this.setState({ maxViewHeight });
    };
    _onKeyboardDidHide = () => {
        this.setState({ maxViewHeight: 0});
    };

    _onTopViewLayout = (ev) => {
        if (this._viewHeight === -1) {
            this._viewHeight = ev.nativeEvent.layout.height;
        }
    };

    _togglePageShow = (show) => {
        if (!this._pageNav) {
            return;
        }

        show ? this._pageNav.show() : this._pageNav.hide();
    };

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            posts: [],
            maxViewHeight: 0
        };

        this._replyBox = null;
        this._pageNav = null;
        this._postList = null;

        this._viewHeight = -1;
    }

    _doRender() {
        const { links, posts, maxViewHeight } = this.state;
        const replyBox = (
            <ReplyBox
                ref={(component) => (this._replyBox = component)}
                onSubmit={this._doReply}
                style={styles.replyBox}
                onTyping={() => this._togglePageShow(false)}
            />
        );

        const postListStyles = [styles.postList];
        if (maxViewHeight > 0) {
            postListStyles.push({
                flex: 0,
                height: maxViewHeight
            });
        }

        return (
            <SafeAreaView style={styles.container} onLayout={this._onTopViewLayout}>
                <View style={postListStyles}>
                    <PostList
                        ref={(c) => this._postList = c}
                        posts={posts}
                        navigation={this.props.navigation}
                        onMomentumScrollBegin={() => this._togglePageShow(false)}
                        onMomentumScrollEnd={() => this._togglePageShow(true)}
                    />
                </View>

                <View>{replyBox}</View>

                {links && (
                    <PageNav
                        ref={(c) => (this._pageNav = c)}
                        links={links}
                        gotoPage={this._gotoPage}
                    />
                )}
            </SafeAreaView>
        );
    }

    _doLoadData = () => {
        const threadId = this.props.navigation.getParam('id');
        if (!threadId) {
            throw new Error('Must be pass id into navigation params!');
        }

        BatchApi.addRequest('get', `threads/${threadId}`);
        BatchApi.addRequest('get', 'posts', {
            thread_id: threadId
        });

        BatchApi.dispatch()
            .then((response) => {
                this._onResponse(
                    response.posts,
                    response[`threads/${threadId}`].thread
                );
            })
            .catch(() => this._setLoadingState(LoadingState.Error));
    };

    componentDidMount() {
        this._doLoadData();

        this._keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            this._onKeyboardDidShown
        );
        this._keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._onKeyboardDidHide
        );
    }

    componentWillUnmount(): void {
        this._keyboardDidShowListener.remove();
        this._keyboardDidHideListener.remove();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    postList: {
        flex: 1
    }
});
