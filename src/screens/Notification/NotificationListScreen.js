import React from 'react'
import {SafeAreaView, Alert} from 'react-native'
import BaseScreen, {LoadingState} from "../BaseScreen";
import NotificationApi from "../../api/NotificationApi";
import {Style} from "../../Style";
import NotificationList from "./NotificationList";
import ButtonIcon from "../../components/ButtonIcon";
import Visitor from "../../utils/Visitor";

const markReadAll = () => {
    NotificationApi.markAllRead()
        .then(() => {})
        .catch(() => {});
};

const confirmMarkReadAll = () => {
    Alert.alert(
        'Mark notifications read',
        'Are you sure you want to mark all notifications read?',
        [
            {text: 'Cancel'},
            {text: 'OK', onPress: markReadAll}
        ]
    );
};

export default class NotificationListScreen extends BaseScreen {
    static navigationOptions = () => {
        const headerRightStyle = {
            marginRight: 10
        };

        return {
            title: 'Notifications',
            headerRight: (<ButtonIcon iconName={'check-square'} style={headerRightStyle} onPress={confirmMarkReadAll}/>)
        }
    };

    _doLoadData = () => {
        if (Visitor.isGuest()) {
            this._setLoadingState(LoadingState.Done);

            return;
        }

        const isRefreshing = false;

        NotificationApi.getList()
            .then((response) => {
                const {notifications} = response;

                this._setLoadingState(LoadingState.Done, { notifications, isRefreshing });
            })
            .catch(() => this._setLoadingState(LoadingState.Error, { isRefreshing }));
    };

    _pullRefreshData = () => {
        this.setState({ isRefreshing: true });
        this._doLoadData();
    };

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            isRefreshing: false
        };
    }

    componentDidMount(): void {
        this._doLoadData();
    }

    _doRender() {
        if (Visitor.isGuest()) {
            return this._doRenderRequireAuth();
        }

        const {notifications, isRefreshing} = this.state;

        return (
            <SafeAreaView style={Style.container}>
                <NotificationList
                    notifications={notifications}
                    navigation={this.props.navigation}
                    refreshing={isRefreshing}
                    onRefresh={this._pullRefreshData}
                />
            </SafeAreaView>
        );
    }
}
