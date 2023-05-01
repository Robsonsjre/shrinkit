import React, { useState } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const Home = () => {
  const [file, setFile] = useState(null);
  const [chunks, setChunks] = useState([]);

  const handleDrop = (receivedFile) => {
    console.log('handleDrop')
    console.log(receivedFile[0])
    setFile(receivedFile[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);
    try {
      const response = await fetch("/api/shrink", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setChunks(data.shrunkenChunks)
      } else {
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //   try {
  //     const response = await axios.post('/api/test-upload', formData);

  //     setChunks(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-10">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl text-center font-bold text-gray-900 mb-2">
              PDF Shrinker
            </h1>
            <p className="text-lg text-gray-700 text-center">
              Upload a PDF file and we'll extract the text and break it into
              smaller chunks for you!
            </p>
          </div>

          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                className="border-2 border-dashed border-gray-400 rounded-lg px-6 py-10 flex flex-col justify-center items-center cursor-pointer bg-white"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <p className="text-gray-700 text-lg leading-tight">
                  Drag and drop a PDF file here, or click to select a file
                </p>
              </div>
            )}
          </Dropzone>

          {file && (
            <div className="mt-8">
              <p className="text-gray-700 text-lg leading-tight">
                Selected file: {file.name}
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleSubmit}
              >
                Shrink it for me!
              </button>
            </div>
          )}

          {chunks.length > 0 && (
            <div className="mt-8">
              <p className="text-gray-700 text-lg leading-tight">
                Number of chunks: {chunks.length}
              </p>
              <ul className="mt-4">
                {chunks.map((chunk, index) => (
                  <li
                    className="bg-white border border-gray-200 p-4 rounded-lg mt-2"
                    key={index}
                  >
                    {chunk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
