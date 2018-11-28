import React from 'react';
import {SafeAreaView, View, Keyboard, Platform, LayoutAnimation, StyleSheet} from 'react-native'
import BaseScreen, {LoadingState} from "../BaseScreen";
import BatchApi from "../../api/BatchApi";
import {Style} from "../../Style";
import PageNav from "../../components/PageNav";
import ReplyBox from "../../components/ReplyBox";
import ConversationApi from "../../api/ConversationApi";
import MessageList from "./MessageList";
import {Fetcher} from "../../utils/Fetcher";

export default class ConversationDetailScreen extends BaseScreen {
    static navigationOptions = ({navigation}) => {
        const convoTitle = navigation.getParam('title');

        return {
            title: convoTitle
        };
    };

    _gotoPage = (link, page) => {
        this._setLoadingState(LoadingState.Begin);

        Fetcher.get(link, {page: page})
            .then((response) => {
                const {messages, links} = response;

                this._setLoadingState(LoadingState.Done, { messages, links });
            })
            .catch(() => this._setLoadingState(LoadingState.Error));
    };

    _onSubmit = (message) => {
        const {conversation} = this.state;
        this._replyBox.toggleEnabled(false);

        ConversationApi.reply(conversation.conversation_id, message)
            .then((response) => {
                const {message} = response;
                this._replyBox.clear();

                this.setState((prevState) => ({
                    ...prevState,
                    messages: [
                        ...prevState.messages,
                        message
                    ]
                }), () => this._messageList.scrollToEnd());
            })
            .catch(() => this._replyBox.toggleEnabled(true));
    };

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
            mavViewHeight: 0
        };

        this._pageNav = null;
        this._replyBox = null;
        this._messageList = null;
        this._viewHeight = -1;
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
                const conversation = response[`conversations/${convoId}`].conversation;
                const messages = response['conversation-messages'].messages;
                const links = response['conversation-messages'].links;

                this._setLoadingState(LoadingState.Done, { conversation, messages, links });
            })
            .catch(() => this._setLoadingState(LoadingState.Error));

        this._keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            this._onKeyboardDidShown
        );
        this._keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._onKeyboardDidHide
        );
    }

    _doRender() {
        const {links, messages, conversation, maxViewHeight} = this.state;

        const postListStyles = [styles.postList];
        if (maxViewHeight > 0) {
            postListStyles.push({
                flex: 0,
                height: maxViewHeight
            });
        }

        return (
            <SafeAreaView style={Style.container} onLayout={this._onTopViewLayout}>
                <View style={postListStyles}>
                    <MessageList
                        ref={(c) => this._messageList = c}
                        messages={messages}
                        navigation={this.props.navigation}
                    />
                </View>

                {conversation.permissions.reply
                    && <ReplyBox
                        ref={(c) => this._replyBox = c}
                        onSubmit={this._onSubmit}/>}

                {links && <PageNav
                    ref={(c) => this._pageNav = c}
                    links={links}
                    gotoPage={this._gotoPage}/>}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    postList: {
        flex: 1
    }
});
