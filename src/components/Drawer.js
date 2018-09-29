import React from 'react';
import PropTypes from 'prop-types';
import {ButtonIcon} from "./Button";
import {FlatList, Text, TouchableHighlight, View} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {style} from "../Style"
import {objectStore} from "../data/objectStore";
import Avatar from "./Avatar";
import {Config} from "../Config";
import {simpleEventDispatcher} from "../events/simpleEventDispatcher";


class DrawerTrigger extends React.Component {
    _onPressed() {
        if (this.props.isBack) {
            this.props.navigation.goBack();
        } else {
            this.props.navigation.toggleDrawer();
        }
    }

    render() {
        const styles = this.props.style ? this.props.style : {};

        return (
            <ButtonIcon iconName={this.props.isBack ? 'chevron-left' : 'menu'}
                        iconColor="red"
                        iconSize={this.props.size}
                        onPress={() => this._onPressed()}/>
        );
    }
}
DrawerTrigger.propTypes = {
    size: PropTypes.number,
    isBack: PropTypes.bool,
    navigation: PropTypes.object
};

DrawerTrigger.defaultProps = {
    size: 25,
    isBack: false
};

class DrawerMenuContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: objectStore.get(Config.Constants.VISITOR)
        };

        this.subscribeId = 0;
    }

    _onPress(item) {
        this.props.navigation.navigate(item.navigationId);
    }

    _doRenderUser() {
        const user = this.state.user;

        return (
            <View style={style.drawer.header}>
                <Avatar url={user.links.avatar} size={60}/>
                <Text style={{ color: '#fff', fontSize: 16, marginTop: 10, fontWeight: 'bold' }}>{user.username}</Text>
            </View>
        );
    }

    componentDidMount() {
        simpleEventDispatcher.subscribe('logged', () => {
            this.setState({
                user: objectStore.get(Config.Constants.VISITOR)
            });
        });
    }

    componentWillUnmount() {
        simpleEventDispatcher.unsubscribe('logged', this.subscribeId);
    }

    render() {
        const navItems = [
            {
                title: 'Home',
                key: 'home',
                icon: 'home',
                navigationId: Config.Constants.SCREEN_HOME
            },
            {
                title: 'Notifications',
                key: 'notifications',
                icon: 'bell',
                navigationId: ''
            },
            {
                title: 'Conversations',
                key: 'conversations',
                icon: 'inbox',
                navigationId: 'Conversation'
            },
            {
                title: 'Forums',
                key: 'forums',
                icon: 'folder',
                navigationId: Config.Constants.SCREEN_FORUM
            },
            {
                title: 'Watched Content',
                key: 'watched_content',
                icon: 'bookmark',
                navigationId: ''
            },
            {
                title: 'Settings',
                key: 'settings',
                icon: 'settings',
                navigationId: ''
            }
        ];

        let userHeader;
        if (this.state.user) {
            userHeader = this._doRenderUser();
        } else {
            userHeader = (<View style={{ height: 120 }}></View>);
        }

        return (
            <View style={style.drawer.container}>
                {userHeader}
                <FlatList
                    data={navItems}
                    renderItem={({item, separators}) => (
                        <TouchableHighlight
                            onPress={() => this._onPress(item)}
                            underlayColor="rgb(237, 246, 253)">

                            <View style={style.drawer.item}>
                                <Icon name={item.icon} size={20} style={{ paddingRight: 20 }} />
                                <Text style={{ fontSize: 16 }}>{item.title}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
        );
    }
}


export {DrawerTrigger, DrawerMenuContent};