import { Transform } from 'stream';
import { Configuration, OpenAIApi } from "openai";

export const shrinkText = async function (inputText, channels, token) {
  console.log('shrinkText function');
  return new Promise(async (resolve, reject) => {
    try {
        const configuration = new Configuration({
            apiKey: process.env.CHATGPT_API_KEY,
          });
          const openai = new OpenAIApi(configuration);
          
          const messageToSend = [
            {role: "system", content: "You are a virtual assistant that helps summarize texts and simplify legal language"},
            {role: "user", content: `Part of the text to be summarized: ${inputText}`}
        ];

        const res = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messageToSend,
            temperature: 0.5,
            stream: true
            }, { responseType: 'stream' } );

            let collectedMessages = '';

            const stream = res.data;
            stream.on('data', (chunk) => {
                // Messages in the event stream are separated by a pair of newline characters.
                const payloads = chunk.toString().split("\n\n");
                for (const payload of payloads) {
                    if (payload.includes('[DONE]')) return;
                    if (payload.startsWith("data:")) {
                        const data = payload.replace(/(\n)?^data:\s*/g, ''); // in case there's multiline data event
                        try {
                            const delta = JSON.parse(data.trim());
                            if (delta.choices[0].delta.content) {
                                const content = delta.choices[0].delta.content
                                collectedMessages = collectedMessages + content
                                channels.trigger(token, 'api-response', content, () => {
                                    res.status(200).end('sent event successfully');
                                  });
                            }
                        } catch (error) {
                            console.log(`Error with JSON.parse and ${payload}.\n${error}`);
                        }
                    }
                }
            });
            
            stream.on('end', () => {
                console.log('Stream done')
                resolve(collectedMessages);
            });
            stream.on('error', (e) => console.error(e));
           
      
    } catch (error) {
      console.error('Error:', error.message);
      reject(error);
    }
  });
};
