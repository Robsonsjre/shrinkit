// components/Footer.js
import React from 'react';
import Link from 'next/link';

const Footer = () => (
  <footer>
    <nav>
      <ul>
      <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/faq">
            <a>FAQ</a>
          </Link>
        </li>
      </ul>
    </nav>

    <style jsx>{`
      footer {
        width: 100%;
        padding: 1rem 0;
        background-color: #f5f5f5;
        text-align: center;
        border-top: 1px solid black;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        display: inline;
        margin: 0 1rem;
      }
      a {
        text-decoration: none;
        color: #333;
      }
      a:hover {
        color: #0070f3;
      }
    `}</style>
  </footer>
);

export default Footer;
