const express = require('express');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('<h1>Hola mundo </h1>');
});

app.post('/webhook',(req, res) => {
    console.log('post: webhook');

    const body = req.body;
    if(body.object === 'page'){
        body.forEach(entry => {
            //se reciben los mensajes
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
            res.status(200).send('Evento Recibido');
        });
    }else {
        res.sendStatus(404);
    }
});
app.get('/webhook',(req, res) => {
    console.log('get: webhook');
    const VERIFY_TOKEN = 'my_verify_token_unique';
    
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if(mode && token){
        if(mode === 'subscribe' && token === VERIFY_TOKEN){
            console.log('WebHook Verificado');
            res.status(200).send(challenge);
        }else{
            res.sendStatus(404);
        }
    }else {
        res.sendStatus(404);
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log('Servidor iniciado');
});
