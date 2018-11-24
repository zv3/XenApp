import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ButtonIcon from '../components/ButtonIcon';
import PropTypes from 'prop-types';

export default class DrawerHeader extends React.PureComponent {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        user: PropTypes.object
    };

    render() {
        const { navigation, user } = this.props;
        let childrenNode;

        if (user) {
            childrenNode = <Text style={styles.user}>{user.username}</Text>;
        } else {
            childrenNode = (
                <ButtonIcon
                    iconName={'log-in'}
                    iconColor={'#FFF'}
                    title={'Log in'}
                    style={styles.button}
                    textColor={'#FFF'}
                    onPress={() => navigation.navigate('Login')}
                />
            );
        }

        return <View style={styles.container}>{childrenNode}</View>;
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        height: 160,
        padding: 15,
        justifyContent: 'flex-end'
    },

    user: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold'
    },

    button: {
        backgroundColor: '#f2930d',
        borderRadius: 4
    }
});
