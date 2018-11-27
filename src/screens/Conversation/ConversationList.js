import React from 'react'
import {SafeAreaView, FlatList} from 'react-native'
import {Style} from "../../Style";
import BaseScreen, {LoadingState} from "../BaseScreen";
import DrawerTrigger from "../../drawer/DrawerTrigger";
import ConversationApi from "../../api/ConversationApi";

export default class ConversationList extends BaseScreen {
    static navigationOptions = () => {
        return {
            title: 'Conversations'
        };
    };

    componentDidMount(): void {
        ConversationApi.getList()
            .then((response) => {
                const {conversations, links} = response;

                this._setLoadingState(LoadingState.Done, { conversations, links });
            })
            .catch(() => this._setLoadingState(LoadingState.Error));
    }

    _doRender() {
        return (
            <SafeAreaView style={Style.container}>

            </SafeAreaView>
        );
    }
}