import express, { Express, Request, Response } from 'express';
import {Kafka} from "kafkajs";
import bodyParser from 'body-parser';


// Initialize app and set up templates
const app: Express = express();
const port = 4200;
app.use(bodyParser.json());

app.set('view engine', 'jade');
app.set('views', './templates');


// Initialize kafka client
const kafka = new Kafka({
  clientId: 'express-server-consumer',
  brokers: [':9092'],
})
const consumer = kafka.consumer({ groupId: 'test-group' })

// Create empty array for messages 
let messages : string[] = []

// Render index page
app.get('/',async (req: Request, res: Response) => {
  res.render('index'),200
});

// Connect and subscribe  to kafka topic 
app.get('/connect', async function(req, res) {
  try{
    await consumer.connect()
    await consumer.subscribe({ topic: 'messages', fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ topic, partition, message} ) => {
        if (message !== null) {
          const messageValue = message.value;
          if (messageValue !== null) {
            messages.push(messageValue.toString());
          }
        }else{
          console.log('message is empty')
        }
      },
    })
    res.send('ok'),200
  }catch(err){
    console.log(err)
    res.send(err),500
  }
})

// Update messages
app.get('/consume', async function(req, res) {
  res.send({messages: messages}),200
})

// Disconnect from kafka broker
app.get('/disconnect', async function(req, res) {
  await consumer.disconnect()
  res.send('ok'),200
})

app.listen(port,() => {
  console.log(`App listening on http://localhost:${port}`)
});
