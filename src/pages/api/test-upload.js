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

  res.status(200).json({ message: 'File uploaded successfully', filename: file.originalname });
}

export const config = {
    api: {
      bodyParser: false
    }
  }
