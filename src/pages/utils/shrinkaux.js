const axios = require('axios')

// const openAI_URL = 'https://api.openai.com/v1/chat/completions'
const openAI_URL = 'https://api.openai.com/v1/completions'
const apiKey = process.env.NEXT_PUBLIC_CHATGPT_API_KEY

const shrinkText = async function(inputText) {
  console.log('shrinkText function')
  try {
    const promptMod = `Por favor, resuma o texto a seguir em pelo menos metade do tamanho: ${inputText}`

    const params = {
      prompt: promptMod,
      model: 'text-davinci-003',
      temperature: 0.5,
      max_tokens: 3000
    };
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    const response = await axios.post(openAI_URL, params, { headers })
    
    console.log('response', response.data.choices)

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text;
    } else {
      throw new Error('No summary generated.');
    }
  } catch (error) {
    // console.log(error)
    console.error('Error:', error.message);
    throw error
  }
}

module.exports = shrinkText
