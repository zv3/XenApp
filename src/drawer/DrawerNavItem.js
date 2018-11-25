import React from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';

export default class DrawerNavItem extends React.PureComponent {
    static propTypes = {
        item: PropTypes.object.isRequired,
        onPress: PropTypes.func.isRequired
    };

    render() {
        const { item, onPress } = this.props;

        return (
            <TouchableHighlight
                onPress={() => onPress(item)}
                underlayColor="rgb(237, 246, 253)">
                <View style={styles.item}>
                    <Icon name={item.icon} size={20} />
                    <Text style={styles.itemText}>{item.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40
    },

    itemText: {
        fontSize: 18,
        marginLeft: 15
    }
});
