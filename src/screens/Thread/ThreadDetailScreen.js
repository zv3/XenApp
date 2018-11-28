import React from 'react';
import {
    View,
    FlatList,
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
import PostCard, { PostCardSeparator } from '../../components/PostCard';
import ReplyBox from '../../components/ReplyBox';
import PostApi from '../../api/PostApi';

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
        const threadId = this.props.navigation.getParam('threadId');

        PostApi.create(threadId, message)
            .then((response) => {
                if (this._replyBox !== null) {
                    this._replyBox.clear();
                }

                const { post } = response;
                this.setState((prevState) => ({
                    ...prevState,
                    posts: [...prevState.posts, post]
                }));

                this._postList.scrollToEnd({
                    animated: true
                });
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
        this._setLoadingState(LoadingState.Done);

        const newState = { ...response };
        if (thread) {
            newState.thread = thread;
        }

        this.setState(newState);

        if (this._pageNav) {
            setTimeout(() => {
                this._pageNav.show();
            }, 1000);
        }
    };

    _onMomentumScrollBegin = () => this._pageNav && this._pageNav.hide();
    _onMomentumScrollEnd = () => this._pageNav && this._pageNav.show();

    _onKeyboardDidShown = (ev) => {
        const { endCoordinates } = ev;

        this._pageNav && this._pageNav.hide();
        const maxViewHeight = this._viewHeight - endCoordinates.height - this._replyBox.getLayoutHeight();

        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
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
            />
        );
        const renderItem = (item) => <PostCard post={item} />;

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
                    <FlatList
                        ref={(c) => (this._postList = c)}
                        renderItem={({ item }) => renderItem(item)}
                        data={posts}
                        ItemSeparatorComponent={PostCardSeparator}
                        keyExtractor={(item, index) => item + index}
                        maxToRenderPerBatch={1}
                        initialNumToRender={1}
                        numColumns={1}
                        onMomentumScrollBegin={this._onMomentumScrollBegin}
                        onMomentumScrollEnd={this._onMomentumScrollEnd}
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

        Fetcher.post('batch', JSON.stringify(batchParams))
            .then((response) => {
                const { jobs } = response;
                this._onResponse(
                    jobs.posts,
                    jobs[`threads/${threadId}`].thread
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