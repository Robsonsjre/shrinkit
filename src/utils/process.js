const PDFParser = require('pdf-parse');
const { Readable } = require('stream');

async function processPDF(file) {
  try {
    const dataBuffer = file.buffer;
    const data = await PDFParser(dataBuffer);
    const textContent = data.text.replace(/(\r\n|\n|\r)/gm, '');
    const chunkSize = 1000;
    const chunks = [];
    let startIndex = 0;

    while (startIndex < textContent.length) {
      let endIndex = startIndex + chunkSize;
      while (endIndex < textContent.length && textContent[endIndex] !== ' ') {
        endIndex++;
      }
    
      chunks.push(textContent.slice(startIndex, endIndex));
      startIndex = endIndex;
    }

    console.log('chunks size', chunks.length);
    return chunks;
  } catch (error) {
    console.log(error);
  }
}

module.exports = processPDF;
