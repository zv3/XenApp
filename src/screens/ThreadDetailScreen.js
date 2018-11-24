import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import BaseScreen, { LoadingState } from './BaseScreen';
import { fetcher } from '../utils/Fetcher';
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

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            showPageNav: false
        };

        this._replyBox = null;
    }

    _gotoPage(/*link, page*/) {}

    _doRenderPageNav() {
        if (!this.state.showPageNav || !this.state.links) {
            return null;
        }

        return (
            <PageNav
                links={this.state.links}
                gotoPage={(link, page) => this._gotoPage(link, page)}
            />
        );
    }

    _doRender() {
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
                        data={this.state.posts}
                        ItemSeparatorComponent={PostCardSeparator}
                        keyExtractor={(item) => JSON.stringify(item.post_id)}
                        maxToRenderPerBatch={1}
                        initialNumToRender={1}
                    />
                </View>
                {replyBox}
            </SafeAreaView>
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

        fetcher
            .post('batch', JSON.stringify(batchParams))
            .then((response) => {
                this._setLoadingState(LoadingState.Done);

                this.setState({
                    thread: response.jobs[`threads/${threadId}`].thread,
                    posts: response.jobs.posts.posts,
                    links: response.jobs.posts.links
                });
            })
            .catch(() => {
                this._setLoadingState(LoadingState.Error);
            });
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
