const { Router } = require('express');
const request = require('request');
const router = Router();

const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;


router.get('/', (req, res) => {
    res.status(200).send('<h1>Hola mundo </h1>');
});

router.post('/webhook',(req, res) => {
    console.log('post: webhook');

    const body = req.body;
    if(body.object === 'page'){

        body.entry.forEach(entry => {
            //se reciben los mensajes
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
           
            
           const sender_psid = webhookEvent.sender.id;
           console.log(`Sender PSID: ${sender_psid}`);
           //validar si estamos recibiendo un mensaje
            if(webhookEvent.message){
                handleMessage(sender_psid, webhookEvent.message);
            }else if(webhookEvent.postback){
                handlePostBack(sender_psid, webhookEvent.postback)
            }
        });
        res.status(200).send('Evento Recibido');
        
    }else {
        res.sendStatus(404);
    }
});


router.get('/webhook',(req, res) => {
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
        res.status(404).send('no pude ingresar');
    }
});


//administracion de eventos
function handleMessage(sender_psid, received_message){
    let response;
    if(received_message.text){
        response = {
            'text': `Tu mensaje fue: ${received_message.text}`,
        };
    }

    callSendAPI(sender_psid, response)
}
//funcionalidad de postback
function handlePostBack(sender_psid, received_message){
    
}

//enviar los mensajes de regreso
function callSendAPI(sender_psid, response){
    const requestBody = {
        'recipient': {
            'id': sender_psid
        },
        'message': response
    };
    request({
        'url': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': {'access_token': pageAccessToken},
        'method': 'POST',
        'json': requestBody
    }, (error, res, body) => {
        if(!error){
            console.log('Mensaje enviado de vuelta');
        }else{
            console.log('imposible enviar mensaje');
        }
    });
}


module.exports = router;