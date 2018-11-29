import {} from 'react-native'
import BaseScreen from "../BaseScreen";

export default class ConversationAddScreen extends BaseScreen {
    static navigationOptions = () => {
        return {
            title: 'Create new conversation'
        }
    };

    _doRender() {
        return null;
    }
}