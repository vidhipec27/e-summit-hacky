import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './EntreConnect.css';
import entrepreneurImg from '../assets/entrepreneur.png';

const EntreConnect = () => {
  const [name, setName] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const openGoogleForm = () => {
    window.open('https://forms.gle/hTUcxa3W8C5ztEQQ6', '_blank');
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const generateMatches = async () => {
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Email',
        text: 'Please enter your Email!',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/find_matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: name }),
      });
      const data = await response.json();
      if (response.ok) {
        setMatches(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'No matches found.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to fetch matches. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entreconnect-container">
      <header className="entreconnect-header">
        <img src={entrepreneurImg} alt="Entrepreneur working" className="entreconnect-img" />
        <h1>EntreConnect</h1>
        <p>Find like-minded entrepreneurs and connect with them!</p>
        <button className="cta-btn" onClick={openGoogleForm}>
          Fill Out The Entrepreneur Form And Get Started
        </button>
      </header>
      <div className="entreconnect-input-section">
        <input
          type="text"
          placeholder="Enter your Email"
          value={name}
          onChange={handleNameChange}
          disabled={loading}
          className="entreconnect-input"
        />
        <button className="entreconnect-btn" onClick={generateMatches} disabled={loading}>
          {loading ? 'Finding Matches...' : 'Find Matches'}
        </button>
      </div>
      {matches.length > 0 && (
        <section className="entreconnect-matches">
          <h2>Your Top Matches</h2>
          <div className="entreconnect-matches-list">
            {matches.map((match, idx) => (
              <div key={idx} className="entreconnect-match-card">
                <h3>{match.Name}</h3>
                <p>Email: {match.Email}</p>
                <p>Experience: {match["How many years of experience do you have in entrepreneurship?"]} years</p>
                <p>Business Stage: {match["What stage is your current business in?"]}</p>
                <p>Risk Tolerance: {match["How risk-tolerant are you in business decisions? (Scale of 1-5)"]}</p>
                <p>Funding Experience: {match["Do you have experience in securing funding?"]}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EntreConnect;