import React from 'react'
import {SafeAreaView, FlatList} from 'react-native'
import {Style} from "../../Style";
import BaseScreen, {LoadingState} from "../BaseScreen";
import ConversationApi from "../../api/ConversationApi";
import PageNav from "../../components/PageNav";
import ConversationList from "./ConversationList";

export default class ConversationListScreen extends BaseScreen {
    static navigationOptions = () => {
        return {
            title: 'Conversations'
        };
    };

    _gotoPage = () => {};

    constructor(props) {
        super(props);

        this._pageNav = null;
    }

    componentDidMount(): void {
        ConversationApi.getList()
            .then((response) => {
                const {conversations, links} = response;

                this._setLoadingState(LoadingState.Done, { conversations, links });
                this._doTogglePageNav(true);
            })
            .catch(() => this._setLoadingState(LoadingState.Error));
    }

    _doTogglePageNav(show) {
        if (this._pageNav === null) {
            return;
        }

        show ? this._pageNav.show() : this._pageNav.hide();
    }

    _doRender() {
        const {conversations, links} = this.state;

        return (
            <SafeAreaView style={Style.container}>
                <ConversationList
                    conversations={conversations}
                    navigation={this.props.navigation}
                    onMomentumScrollBegin={() => this._doTogglePageNav(false)}
                    onMomentumScrollEnd={() => this._doTogglePageNav(true)}
                />
                {links && <PageNav
                    ref={(c) => (this._pageNav = c)}
                    links={links}
                    gotoPage={this._gotoPage}
                />}
            </SafeAreaView>
        );
    }
}