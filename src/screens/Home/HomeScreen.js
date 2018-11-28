import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Fetcher } from '../../utils/Fetcher';
import ButtonIcon from '../../components/ButtonIcon';
import BaseScreen, { LoadingState } from '../BaseScreen';
import PageNav from '../../components/PageNav';
import PropTypes from 'prop-types';
import DrawerTrigger from '../../drawer/DrawerTrigger';
import AuthEvent from '../../events/AuthEvent';
import Avatar from '../../components/Avatar';
import { Visitor } from '../../utils/Visitor';
import BatchApi from '../../api/BatchApi';
import ThreadList from "../../components/ThreadList";

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
        Visitor.getVisitor()
            .then(this._onAuthEvent)
            .catch(() => this._onAuthEvent(null));
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

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            results: [],
            links: null
        };

        this._pageNav = null;
    }

    componentDidMount() {
        BatchApi.addRequest('get', 'threads/recent');
        BatchApi.dispatch()
            .then((response) => {
                const { results, links } = response['threads/recent'];

                this._setLoadingState(LoadingState.Done, { results, links });
            })
            .catch(() => {
                this._setLoadingState(LoadingState.Error);
            });
    }

    _gotoPage(link, page) {
        this._setLoadingState(LoadingState.Begin);
        Fetcher.get(link, {
            query: {
                page: page
            }
        })
            .then((response) => {
                this._setLoadingState(LoadingState.Done);

                this.setState((prevState) => ({
                    ...prevState,
                    results: response.data,
                    links: response.links
                }));
            })
            .catch(() => {
                this._setLoadingState(LoadingState.Error);
            });
    }

    _doRenderPageNav() {
        if (!this.state.links) {
            return null;
        }

        return (
            <PageNav
                ref={(c) => (this._pageNav = c)}
                links={this.state.links}
                gotoPage={(link, page) => this._gotoPage(link, page)}
            />
        );
    }

    _doTogglePageNav(show) {
        if (this._pageNav === null) {
            return;
        }

        show ? this._pageNav.show() : this._pageNav.hide();
    }

    _doRender() {
        return (
            <View style={styles.container}>
                <ThreadList
                    threads={this.state.results}
                    navigation={this.props.navigation}
                    onMomentumScrollBegin={() => this._doTogglePageNav(false)}
                    onMomentumScrollEnd={() => this._doTogglePageNav(true)}
                />
                {this._doRenderPageNav()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
