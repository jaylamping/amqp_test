let Stomp = require('@stomp/stompjs');
let WebSocket = require('ws');

Object.assign(global, { WebSocket });

let wsSubscriptions = {};

//let url = 'wss://www.theuphoria.com/ws/';
let url = 'wss://qa.theuphoria.com/ws/';
let client = new Stomp.Client({
  brokerURL: url,
  connectHeaders: {
    login: 'dimension',
    passcode: 'dimension',
    host: 'qa',
  },
  debug: function (str) {
    console.log(str);
  },
  onConnect: () => {
    console.log('connected');
    const routingKey = `/topic/dim.*.smartgroups.*.exports.*`;
    try {
      wsSubscriptions = client.subscribe(routingKey, (msg) => {
        let body = JSON.parse(msg.body);
        console.log(body);
        if (body.status === 'COMPLETED') {
          client.unsubscribe();
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  onStompError: (frame) => {
    console.log('Broker reported error: ' + frame.headers['message']);
    console.log('Additional details: ' + frame.body);
  },
});

try {
  client.activate();
} catch (err) {
  console.log(err);
}
