// Used for environment variables
import * as dotenv from 'dotenv';
dotenv.config();

// INIT OPENAI SDK and Configuration object which requires the API key
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

// Express is a middleware framework that allows us to run some code on incoming requests
import express from 'express';
// cors is a security mechanism
import cors from 'cors';

const app = express();
app.use(cors());
// this line makes it so our node app only accepts json requests
app.use(express.json());

app.get('/', function(req, res){
    res.sendFile('./index.html');
});

// API EndPoint
app.post('/dream', async (req, res) => {
    try{
        const prompt = req.body.prompt;

        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
        });
        
        const image = aiResponse.data.data[0].url;
        res.send({ image });
    } catch (error) {
        console.error(error)
        res.status(500).send(error?.response.data.error.message || 'Something went wrong');
    }
});

app.listen(5173, () => console.log('make art on http://localhost:5173/dream'));
