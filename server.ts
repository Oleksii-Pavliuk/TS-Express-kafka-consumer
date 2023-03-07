import express, { Express, Request, Response } from 'express';
import {Kafka} from "kafkajs";

// Initialize app
const app: Express = express();
const port = 4200;
// Initialize kafka client
const kafka = new Kafka({
    clientId: 'express-server',
    brokers: ['kafka1:9092', 'kafka2:9092'],
  })




try{
    app.get('/', (req: Request, res: Response) => {
    res.send('Consumer');
    });
}catch(err){
    console.log(err)
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});