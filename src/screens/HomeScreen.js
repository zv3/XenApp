import React from "react"
import {View, AsyncStorage, FlatList} from "react-native"
import {fetcher} from "../utils/Fetcher";
import {DrawerTrigger} from "../components/Drawer";
import {ButtonIcon} from "../components/Button";
import {oneTimeToken} from "../utils/Token";
import BaseScreen, {LoadingState} from "./BaseScreen";
import ThreadRow, {ThreadRowSeparator} from "../components/ThreadRow";
import PageNav from "../components/PageNav";

class HomeHeaderRight extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accessToken: null
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('oauthData')
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                // need login.
            })
    }

    render() {
        if (this.state.accessToken === null) {
            return null;
        }

        return (
            <View style={{ flex: 1, flexDirection: 'row', marginRight: 10 }}>
                <ButtonIcon iconName="log-in" onPress={() => {
                    this.props.navigation.navigate('Login');
                }} />
            </View>
        );
    }
}

export default class HomeScreen extends BaseScreen {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home',
            headerRight: (<HomeHeaderRight navigation={navigation}/>),
            headerLeft: (<DrawerTrigger navigation={navigation}/>)
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            results: [],
            showPageNav: false
        };
    }

    componentDidMount() {
        const batchParams = [
            {
                method: 'GET',
                uri: 'threads/recent'
            }
        ];

        fetcher.post(`batch&oauth_token=${oneTimeToken()}`, {
            body: JSON.stringify(batchParams)
        }).then((response) => {
            this._setLoadingState(LoadingState.Done);

            const results = response.jobs['threads/recent'];

            this.setState({
                results: results.results,
                links: results.links,
                showPageNav: true
            });
        }).catch((error) => {
            this._setLoadingState(LoadingState.Error);
        });
    }

    _gotoPage(link, page) {
        this._setLoadingState(LoadingState.Begin);
        fetcher.get(link, {
            query: {
                page: page
            }}
        ).then((response) => {
            this._setLoadingState(LoadingState.Done);

            this.setState(prevState => ({
                ...prevState,
                results: response.data,
                links: response.links
            }));
        }).catch((error) => {
            this._setLoadingState(LoadingState.Error);
        });
    }

    _doRenderPageNav() {
        if (!this.state.showPageNav || !this.state.links) {
            return null;
        }

        return <PageNav ref="PageNav" links={this.state.links} gotoPage={(link, page) => this._gotoPage(link, page)}/>;
    }

    _doTogglePageNav(show) {
        show
            ? this.refs.PageNav.show()
            : this.refs.PageNav.hide();
    }

    _doRender() {
        return (
            <View>
                <FlatList renderItem={({item}) => <ThreadRow thread={item} navigation={this.props.navigation}/>}
                          data={this.state.results}
                          onMomentumScrollBegin={() => this._doTogglePageNav(false)}
                          onMomentumScrollEnd={() => this._doTogglePageNav(true)}
                          ItemSeparatorComponent={() => ThreadRowSeparator()}
                          keyExtractor={(item, index) => JSON.stringify(item.thread_id)}/>
                {this._doRenderPageNav()}
            </View>
        );
    }
}
