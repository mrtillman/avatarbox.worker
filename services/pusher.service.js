require("dotenv").config();
const Pusher = require("pusher");

class PusherService {
  constructor(channelId) {
    this.channelId = channelId;
    this.eventName = "update-event";
    this.self = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });
  }
  send(message) {
    this.self.trigger(this.channelId, this.eventName, { message });
  }
}

module.exports = PusherService;
