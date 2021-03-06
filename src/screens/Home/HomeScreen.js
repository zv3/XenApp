import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Fetcher } from '../../utils/Fetcher';
import ButtonIcon from '../../components/ButtonIcon';
import BaseScreen, { LoadingState } from '../BaseScreen';
import PageNav from '../../components/PageNav';
import PropTypes from 'prop-types';
import DrawerTrigger from '../../drawer/DrawerTrigger';
import AuthEvent from '../../events/AuthEvent';
import Avatar from '../../components/Avatar';
import Visitor from '../../utils/Visitor';
import BatchApi from '../../api/BatchApi';
import ThreadList from "../../components/ThreadList";
import {Style} from "../../Style";
import moment from "moment";

class HomeHeaderRight extends React.PureComponent {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    state = {
        avatarUrl: null
    };

    _onAuthEvent = (visitor) =>
        this.setState({ avatarUrl: visitor && visitor.links.avatar_small });

    componentDidMount(): void {
        AuthEvent.addListener(this._onAuthEvent);
        if (!Visitor.isGuest()) {
            this._onAuthEvent(Visitor.getVisitor());
        }
    }

    componentWillUnmount(): void {
        AuthEvent.removeListener(this._onAuthEvent);
    }

    render() {
        const { avatarUrl } = this.state;
        if (avatarUrl) {
            const viewStyle = {
                container: {
                    marginRight: 10
                }
            };

            return (
                <View style={viewStyle.container}>
                    <Avatar
                        uri={avatarUrl}
                        size={28}
                        style={viewStyle.avatar}
                    />
                </View>
            );
        } else {
            const loginStyle = {
                flex: 1,
                flexDirection: 'row',
                marginRight: 10
            };
            return (
                <View style={loginStyle}>
                    <ButtonIcon
                        iconName="log-in"
                        onPress={() => {
                            this.props.navigation.navigate('Login');
                        }}
                    />
                </View>
            );
        }
    }
}

export default class HomeScreen extends BaseScreen {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Home',
            headerRight: <HomeHeaderRight navigation={navigation} />,
            headerLeft: <DrawerTrigger navigation={navigation} />
        };
    };

    _gotoPage = (link, page) => {
        this._setLoadingState(LoadingState.Begin);

        Fetcher.get(link, {
                query: {
                    page: page
                }
            })
            .then((response) => {
                const {threads, links} = response;

                this._setLoadingState(LoadingState.Done, { threads, links });
                this._doTogglePageNav(true);
            })
            .catch(() => this._setLoadingState(LoadingState.Error));
    };

    _doTogglePageNav = (show) => {
        if (this._pageNav === null) {
            return;
        }

        show ? this._pageNav.show() : this._pageNav.hide();
    };

    _onPullRefresh = () => this._doLoadData();

    _doLoadData = () => {
        this.setState({ isRefreshing: true });
        if (Visitor.isGuest()) {
            BatchApi.addRequest('get', 'threads/recent');
        } else {
            BatchApi.addRequest('get', 'threads', {
                order: 'thread_update_date_reverse',
                thread_update_date: moment().format('X')
            });
        }

        BatchApi.dispatch()
            .then((response) => {
                let threads, links;
                if (Visitor.isGuest()) {
                    threads = response['threads/recent'].results;
                    links = response['threads/recent'].links;
                } else {
                    threads = response.threads.threads;
                    links = response.threads.links;
                }
                const isRefreshing = false;

                this._setLoadingState(LoadingState.Done, { threads, links, isRefreshing });
                this._doTogglePageNav(true);
            })
            .catch(() => this._setLoadingState(LoadingState.Error, { isRefreshing: false }));
    };

    _doReload() {
        this._doLoadData();
    }

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            isRefreshing: false,
            threads: [],
            links: null
        };

        this._pageNav = null;
    }

    componentDidMount() {
        this._doLoadData();
    }

    _doRender() {
        const {threads, links, isRefreshing} = this.state;

        return (
            <SafeAreaView style={Style.container}>
                <ThreadList
                    threads={threads}
                    navigation={this.props.navigation}
                    onMomentumScrollBegin={() => this._doTogglePageNav(false)}
                    onMomentumScrollEnd={() => this._doTogglePageNav(true)}
                    refreshing={isRefreshing}
                    onRefresh={this._onPullRefresh}
                />
                {links && <PageNav
                    ref={(c) => (this._pageNav = c)}
                    links={this.state.links}
                    gotoPage={this._gotoPage}
                />}
            </SafeAreaView>
        );
    }
}
