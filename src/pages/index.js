import React, { useState, useEffect, useRef } from 'react';
import Dropzone from 'react-dropzone';
import Pusher from "pusher-js";
import posthog from 'posthog-js'

posthog.init('phc_aUOOyajS1kR3cyR6awBKQMYxqNAw5PJSiu1fDxmjcB4', { api_host: 'https://app.posthog.com' })

const Home = () => {
  const [file, setFile] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [subscribeId, setSubscribeId] = useState('')
  const socketRef = useRef()

  var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
  };

  var token = function() {
    return rand(); // to make it longer
  };


  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_PUBLIC_KEY, {
      cluster: "mt1",
    });

    const subcribeId = `chat-gpt-${token()}`
    setSubscribeId(subcribeId)
    const channel = pusher.subscribe(subcribeId);

    channel.bind("api-response", function (data) {
      console.log("api-response")
      setMessages((prevState) => prevState + data);
    });

    return () => {
      pusher.unsubscribe(subcribeId);
    };
  }, []);


  const handleDrop = (receivedFile) => {
    console.log('handleDrop')
    posthog.capture('upload_document', { property: { fileName: receivedFile[0].name } })
    setFile(receivedFile[0]);
  }

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    posthog.capture('generate_summary', { property: 'handleSubmit' })

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("token", subscribeId);
    try {
      const response = await fetch("/api/shrink", {
        method: "POST",
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        setChunks(data.shrunkenChunks)
        setLoading(false);

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
              {loading && (
                <p className="mt-4 text-gray-700 text-lg">Loading, please wait...</p>
)             }
            </div>
          )}

          {messages.length > 0 && (
            <div className="mt-8">
              {/* <p className="text-gray-700 text-lg leading-tight">
                Number of chunks: {chunks.length}
              </p> */}
              <ul className="mt-4">
                  <li
                    className="text-gray-900 bg-white border border-gray-200 p-4 rounded-lg mt-2"
                    key={1}
                  >
                    {messages}
                  </li>
              </ul>
            </div>
          )}
          <div className="bg-gray-100">
      {/* <h1 className="text-gray-900">Real-time Shrinking</h1> */}
      {/* <ul className="text-gray-900">
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul> */}
      {/* <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit">Send</button> 
      </form> */}
    </div>
        </div>
      </div>
      
    </div>
  );
};

export default Home;
