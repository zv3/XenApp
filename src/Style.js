import {StyleSheet, Dimensions} from "react-native"

const button = {
    primary: {
        backgroundColor: '#2577b1',
    },
    textPrimary: {
        color: '#edf6fd'
    },

    highlighted: {
        // backgroundColor: '#f2930d'
    },
    textHighlighted: {
        color: '#f2930d'
    },

    disabled: {
        backgroundColor: '#efefef'
    },
    textDisabled: {
        color: '#8c8c8c'
    },

    container: {
        padding: 10,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
};

const input = {
    normal: {
        borderBottomWidth: 1,
        // width: '100%',
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: 'rgba(0,0,0,.1)',
        color: 'red',
        fontSize: 18,
        // flexGrow: 1
    },

    focus: {
        borderBottomColor: 'red'
    },

    placeholder: {
        color: "#8c8c8c"
    }
};

const avatar = {
    circle: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        borderRadius: 20
    }
};

const link = {
    default: {
        fontSize: 18,
        color: '#2577b1'
    }
};

const drawer = {
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
};

const dateRelative = {
    text: {
        fontSize: 16,
        color: '#8c8c8c'
    }
};

const pageNav = {
    container: {
        position: 'absolute',
        bottom: 80,
        left: (Dimensions.get('window').width - 200)/2,
        width: 200,
        height: 30,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5
    },
    text: {
        color: 'white',
        fontSize: 18
    }
};

const replyBox = {
   container: {
       padding: 10,
       backgroundColor: 'white',
       // flexDirection: 'row',
       // justifyContent: 'center'
   }
};

export const style = {
    button,
    input,
    avatar,
    link,
    drawer,
    dateRelative,
    pageNav,
    replyBox
};