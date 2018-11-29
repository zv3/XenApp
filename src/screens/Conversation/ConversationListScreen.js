import React from 'react'
import {SafeAreaView} from 'react-native'
import {Style} from "../../Style";
import BaseScreen, {LoadingState} from "../BaseScreen";
import ConversationApi from "../../api/ConversationApi";
import PageNav from "../../components/PageNav";
import ConversationList from "./ConversationList";
import DrawerTrigger from "../../drawer/DrawerTrigger";
import {Fetcher} from "../../utils/Fetcher";
import ButtonIcon from "../../components/ButtonIcon";
import Visitor from "../../utils/Visitor";

export default class ConversationListScreen extends BaseScreen {
    static navigationOptions = ({navigation}) => {
        const headerRightStyle = {
            marginRight: 10
        };

        const addNewConvo = () => navigation.navigate('ConversationAdd');

        return {
            title: 'Conversations',
            headerLeft: <DrawerTrigger navigation={navigation}/>,
            headerRight: <ButtonIcon iconName={'plus'} style={headerRightStyle} onPress={addNewConvo}/>
        };
    };

    _gotoPage = (link, page) => {
        this._setLoadingState(LoadingState.Begin);

        Fetcher.get(link, {page: page})
            .then(response => {
                const {conversations, links} = response;
                this._setLoadingState(LoadingState.Done, { conversations, links });
                this._doTogglePageNav(true);
            })
            .catch(() => {
                this._setLoadingState(LoadingState.Error)
            });
    };

    _pullRefreshData = () => {
        this.setState({ isRefreshing: true });
        this._doLoadData();
    };

    _doLoadData = () => {
        if (Visitor.isGuest()) {
            this._setLoadingState(LoadingState.Done);

            return;
        }

        const isRefreshing = false;

        ConversationApi.getList()
            .then((response) => {
                const {conversations, links} = response;

                this._setLoadingState(LoadingState.Done, { conversations, links, isRefreshing });
                this._doTogglePageNav(true);
            })
            .catch(() => this._setLoadingState(LoadingState.Error, { isRefreshing }));
    };

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            isRefreshing: false
        };

        this._pageNav = null;
    }

    componentDidMount(): void {
        this._doLoadData();
    }

    _doTogglePageNav(show) {
        if (this._pageNav === null) {
            return;
        }

        show ? this._pageNav.show() : this._pageNav.hide();
    }

    _doReload() {
        this._setLoadingState(LoadingState.Begin);
        this._doLoadData();
    }

    _doRender() {
        if (Visitor.isGuest()) {
            return this._doRenderRequireAuth();
        }

        const {conversations, links, isRefreshing} = this.state;

        return (
            <SafeAreaView style={Style.container}>
                <ConversationList
                    conversations={conversations}
                    navigation={this.props.navigation}
                    onMomentumScrollBegin={() => this._doTogglePageNav(false)}
                    onMomentumScrollEnd={() => this._doTogglePageNav(true)}
                    refreshing={isRefreshing}
                    onRefresh={this._pullRefreshData}
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