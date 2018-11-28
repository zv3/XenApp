import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native'
import {Style} from "../Style";
import { NavigationActions } from 'react-navigation';

type Props = {
    userId: Number,
    name: String,
    navigation: Object,
    style?: Array | Object,
    userStyle?: Array | Object
};
export default class UserName extends React.PureComponent<Props> {
    _onPress = () => {
        const {navigation, userId, name} = this.props;

        navigation.dispatch(
            NavigationActions.navigate({
                routeName: 'User',
                key: `user_${userId}`,
                params: {
                    userId: userId,
                    name: name
                }
            })
        );
    };

    render() {
        const {name, style, userStyle} = this.props;

        return (
            <TouchableOpacity
                accessibilityLabel={name}
                accessibilityRole="button"
                onPress={this._onPress}>
                <View style={style}>
                    <Text style={[Style.userName, userStyle]}>{name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
