// pages/faq.js
import React from 'react';
import { useEffect } from 'react';

const FAQPage = () => {
  useEffect(() => {
    const items = document.querySelectorAll('.faq-item');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  return (
    <div className="page">
      <h1>FAQ</h1>
      <h2>What features does this application use?</h2>
      <ol>
        <li className="faq-item">
          <strong>ChatGPT-3.5-turbo Chat Completion:</strong> This application uses OpenAI's ChatGPT-3.5-turbo model for generating conversational responses. It provides a powerful and efficient way to interact with the GPT-3.5 model, allowing the creation of dynamic and engaging conversations.
        </li>
        <li className="faq-item">
          <strong>Streams + Socket:</strong> To achieve real-time interactivity, this app incorporates streams and sockets. This combination allows for seamless communication between the client and server, enabling real-time updates and responses as users interact with the app.
        </li>
        <li className="faq-item">
          <strong>Vercel Push Service:</strong> The app leverages Vercel's Push service, which provides an easy-to-use WebSocket-based communication channel. This service enables real-time data transfer and ensures a smooth user experience.
        </li>
        <li className="faq-item">
          <strong>Vercel Pro Plan Requirement:</strong> Due to the app's real-time features and increased timeout requirements, it requires a Vercel Pro plan. The Pro plan supports request timeouts above 10 seconds, ensuring the app can handle more complex queries and provide a better user experience.
        </li>
      </ol>

      <style jsx>{`
        .page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          color: #000; // Set the text color to black
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }
        h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }
        ol {
          counter-reset: item;
        }
        li {
          margin-bottom: 1rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s ease forwards;
        }
        li:before {
          counter-increment: item;
          content: counters(item, ".") ". ";
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FAQPage;
