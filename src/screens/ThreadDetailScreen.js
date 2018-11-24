import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import BaseScreen, { LoadingState } from './BaseScreen';
import { Fetcher } from '../utils/Fetcher';
import PropTypes from 'prop-types';
import PageNav from '../components/PageNav';
import PostCard, { PostCardSeparator } from '../components/PostCard';
import ReplyBox from '../components/ReplyBox';

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

    _doReply = () => {
        if (this._replyBox !== null) {
            this._replyBox.clear();
        }
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

        setTimeout(() => {
            this._pageNav && this._pageNav.show();
        }, 1000);
    };

    _onMomentumScrollBegin = () => this._pageNav && this._pageNav.hide();
    _onMomentumScrollEnd = () => this._pageNav && this._pageNav.show();

    constructor(props) {
        super(props);

        this.state = {
            ...this.state
        };

        this._replyBox = null;
        this._pageNav = null;
    }

    _doRender() {
        const { links, posts } = this.state;
        const replyBox = (
            <ReplyBox
                ref={(component) => (this._replyBox = component)}
                onSubmit={this._doReply}
                style={styles.replyBox}
            />
        );
        const renderItem = (item) => <PostCard post={item} />;

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.postList}>
                    <FlatList
                        renderItem={({ item }) => renderItem(item)}
                        data={posts}
                        ItemSeparatorComponent={PostCardSeparator}
                        keyExtractor={(item) => JSON.stringify(item.post_id)}
                        maxToRenderPerBatch={1}
                        initialNumToRender={1}
                        onMomentumScrollBegin={this._onMomentumScrollBegin}
                        onMomentumScrollEnd={this._onMomentumScrollEnd}
                    />
                </View>

                {replyBox}

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
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    postList: {
        flex: 1
    },
    replyBox: {}
});
