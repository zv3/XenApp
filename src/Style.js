import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export const Style = {
    container: {
        flex: 1
    },

    contentCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    userName: {
        fontSize: 14,
        color: '#8c8c8c',
        marginRight: 10
    },

    metaText: {
        fontSize: 14,
        color: '#8c8c8c',
    }
};

export const NotificationStyle = {
    avatarSize: 36,
    item: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        padding: 10
    },
    itemUnread: {
        backgroundColor: '#edf6fd'
    },
    itemMain: {
        marginLeft: 10,
        width: width - 36 - 10 * 2,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    }
};

export const DrawerStyle = {
    itemHighlightedColor: 'rgb(237, 246, 253)',
    item: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40
    },
    itemText: {
        fontSize: 18,
        marginLeft: 15,
        flexGrow: 1
    },
    itemBadge: {
        backgroundColor: 'red',
        padding: 4,
        borderRadius: 4,
        overflow: 'hidden',
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold'
    }
};