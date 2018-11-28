import React from 'react'
import {FlatList, Dimensions} from 'react-native'
import ThreadRow, {ThreadRowSeparator} from "../../components/ThreadRow";

type Props = {
    conversations: Array,
    navigation: Object
};
export default class ConversationList extends React.PureComponent<Props> {
    _keyExtractor = (item) => JSON.stringify(item.conversation_id);
    _renderItem = ({item}) => {
        const creatorUsers = item.recipients.filter((value) => {
           return value.user_id === item.creator_user_id;
        });

        return <ThreadRow
            navigation={this.props.navigation}
            creatorUserId={item.creator_user_id}
            creatorName={item.creator_username}
            createdDate={item.conversation_update_date}
            creatorAvatar={creatorUsers[0] ? creatorUsers[0].avatar_small : undefined}
            title={item.conversation_title}
            routeName={'ConversationDetail'}
            rowId={item.conversation_id}
            message={item.first_message.message_body_plain_text}
        />;
    };

    render() {
        const {conversations} = this.props;

        return (
            <FlatList
                renderItem={this._renderItem}
                data={conversations}
                initialNumToRender={3}
                keyExtractor={this._keyExtractor}
                numColumns={1}
                maxToRenderPerBatch={3}
                ItemSeparatorComponent={ThreadRowSeparator}
                windowSize={Dimensions.get('window').width}
                {...this.props}
            />
        );
    }
}