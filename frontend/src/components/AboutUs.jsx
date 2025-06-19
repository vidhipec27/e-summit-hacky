import React from 'react';
import './AboutUs.css';

const AboutUs = () => (
  <div className="aboutus-container">
    <div className="aboutus-card">
      <h1>About Us</h1>
      <p className="aboutus-mission">
        <strong>Entre-Connect</strong> is dedicated to empowering entrepreneurs by connecting them with like-minded individuals, mentors, and investors. Our mission is to foster innovation, collaboration, and growth in the startup ecosystem.
      </p>
      <h2>What We Do</h2>
      <ul className="aboutus-list">
        <li>AI-driven matching to help entrepreneurs find the right partners and mentors.</li>
        <li>Easy-to-use chat and networking tools for seamless communication.</li>
        <li>Resources and support for every stage of your entrepreneurial journey.</li>
      </ul>
      <h2>Our Vision</h2>
      <p>
        We believe in a world where every entrepreneur has the support and connections they need to succeed. Whether you're just starting out or scaling your business, Entre-Connect is here to help you grow.
      </p>
      <h2>Meet the Team</h2>
      <p>
        We are a passionate group of developers, designers, and business professionals committed to building a vibrant, supportive community for entrepreneurs everywhere.
      </p>
    </div>
  </div>
);

export default AboutUs; 