import React from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Fetcher } from '../utils/Fetcher';
import ButtonIcon from '../components/ButtonIcon';
import BaseScreen, { LoadingState } from './BaseScreen';
import ThreadRow, { ThreadRowSeparator } from '../components/ThreadRow';
import PageNav from '../components/PageNav';
import { Visitor } from '../utils/Visitor';
import PropTypes from 'prop-types';
import DrawerTrigger from '../drawer/DrawerTrigger';

class HomeHeaderRight extends React.Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            visitor: null
        };
    }

    componentDidMount() {
        Visitor.getVisitor()
            .then((visitor) => this.setState({ visitor }))
            .catch(() => this.setState({ visitor: false }));
    }

    render() {
        if (
            this.state.visitor !== null &&
            typeof this.state.visitor === 'object'
        ) {
            const viewStyle = {
                container: {
                    marginRight: 10
                },
                avatar: {
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    resizeMode: 'contain'
                }
            };

            return (
                <View style={viewStyle.container}>
                    <Image
                        source={{ uri: this.state.visitor.links.avatar_small }}
                        style={viewStyle.avatar}
                    />
                </View>
            );
        } else if (this.state.visitor === false) {
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

        return null;
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
        const batchParams = [
            {
                method: 'GET',
                uri: 'threads/recent'
            }
        ];

        Fetcher.post('batch', JSON.stringify(batchParams))
            .then((response) => {
                const { results, links } = response.jobs['threads/recent'];

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
                <FlatList
                    renderItem={({ item }) => (
                        <ThreadRow
                            thread={item}
                            navigation={this.props.navigation}
                        />
                    )}
                    data={this.state.results}
                    onMomentumScrollBegin={() => this._doTogglePageNav(false)}
                    onMomentumScrollEnd={() => this._doTogglePageNav(true)}
                    ItemSeparatorComponent={() => ThreadRowSeparator()}
                    keyExtractor={(item) => JSON.stringify(item.thread_id)}
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
