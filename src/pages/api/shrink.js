import processPDF from '../../utils/process';
import shrinkText from '../../utils/shrinkaux';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }).single('file');

function promisifiedUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload(req, res, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  console.log('caiu aqui')

  try {
    await promisifiedUpload(req, res);
  } catch (error) {
    console.error('Multer error:', error);
    res.status(400).json({ message: 'Error uploading file', error: error.message });
    return;
  }

  const file = req.file;

  if (!file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  try {
    const chunks = await processPDF(file);

    let shrunkenChunks = [];
    // for (let i = 0; i < chunks.length; i++) {
    //     const _chunk = chunks[i];
    //     const shrunkenChunk = await shrinkText(_chunk);
    //     shrunkenChunks.push(shrunkenChunk);
    // }
    shrunkenChunks = await Promise.all(
      chunks.map(async (chunk) => {
        try {
          return await shrinkText(chunk);
        } catch (error) {
          console.error(error);
        }
      })
    );

    // Merge the chunks back into a single string and return it to the client
    // const shrunkenText = chunks.join(' ');
    res.status(200).json({ shrunkenChunks });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}
