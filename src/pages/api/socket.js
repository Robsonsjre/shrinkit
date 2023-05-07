import Pusher from 'pusher-js';

const handler = (req, res) => {
  // Initialize Channels client
let channels = new Pusher('ac0db7820bebe9bc9f89', {
    cluster: 'mt1',
  });
  
  // Subscribe to the appropriate channel
  let channel = channels.subscribe('chat-gpt');
  
  // Bind a callback function to an event within the subscribed channel
    channel.bind('api-response', function (data) {
    // Do what you wish with the data from the event
    console.log('Received data from event: ', data);
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
