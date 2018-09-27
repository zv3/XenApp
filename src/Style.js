import {StyleSheet} from "react-native"

const button = StyleSheet.create({
    primary: {
        backgroundColor: '#2577b1',
    },

    disabled: {
        backgroundColor: '#efefef'
    },

    textPrimary: {
        color: '#edf6fd'
    },

    textDisabled: {
        color: '#8c8c8c'
    },

    container: {
        width: '100%',
        padding: 10,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const input = StyleSheet.create({
    normal: {
        borderBottomWidth: 1,
        width: '100%',
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: 'rgba(0,0,0,.1)',
        color: 'red',
        fontSize: 15
    },

    focus: {
        borderBottomColor: 'red'
    },

    placeholder: {
        color: "#8c8c8c"
    }
});

const avatar = StyleSheet.create({
    circle: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        borderRadius: 20
    }
});

const link = StyleSheet.create({
    default: {
        fontSize: 13,
        color: '#2577b1'
    }
});

const drawer = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(245,245,245)',
        flex: 1,
        borderWidth: 0
    },

    header: {
        backgroundColor: 'red',
        height: 160,
        padding: 15,
        justifyContent:'flex-end'
    },

    item: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export const style = {
    button,
    input,
    avatar,
    link,
    drawer
};