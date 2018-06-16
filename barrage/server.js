let WebSocket = require('ws');

let redis = require('redis');

let client = redis.createClient();//key value

let wss = new WebSocket.Server({

    port :3000
})

let clientArr = [];
//原生的websocket就两个常用的方法，on('message') send();
wss.on('connection', function (ws) {

    clientArr.push(ws);
    client.lrange('barrages', 0, -1, function (err, applies) {

        applies = applies.map(item => JSON.parse(item));
        console.log(applies)
        ws.send(JSON.stringify({
            type: 'INIT',
            data: applies
        }));
    })

    ws.on('message', function (data) {

        console.log(data);
        client.rpush('barrages', data, redis.print);

        let response = {
            type: 'ADD',
            data:JSON.parse(data)
        }

        clientArr.forEach(ws => {

            ws.send(JSON.stringify(response));
        })

    })

    ws.on('close', function () {

        clientArr = clientArr.fliter(client => client != ws);
    })
})