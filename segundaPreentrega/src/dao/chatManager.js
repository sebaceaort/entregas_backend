import { messageModel } from "./models/message.model.js";

class ChatManager {
    async getMessages() {
        return await messageModel.find().lean();
    }

    async createMessage(message) {
        return await messageModel.create(message);
    }
}

export default ChatManager;