// import React, { useState } from 'react';
// import Swal from 'sweetalert2';

// const EntreConnect = () => {
//   const [email, setEmail] = useState('');
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const generateMatches = async () => {
//     if (!email.trim()) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Missing Email',
//         text: 'Please enter your email to find matches.',
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:8080/find_matches', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ user_id: email }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMatches(data);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'No Matches Found',
//           text: data.error || 'No suitable matches found. Please try again.',
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Server Error',
//         text: 'There was an error fetching the matches. Please try again.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <header className="header">
//         <h1>EntreConnect</h1>
//         <p>Find like-minded entrepreneurs and connect with them!</p>
//       </header>

//       <div className="input-container">
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={handleEmailChange}
//           disabled={loading}
//         />
//         <button onClick={generateMatches} disabled={loading}>
//           {loading ? 'Finding Matches...' : 'Find Matches'}
//         </button>
//       </div>

//       {matches.length > 0 && (
//         <section className="matches">
//           <h2>Your Top Matches</h2>
//           <div className="matches-list">
//             {matches.map((match, idx) => (
//               <div key={idx} className="match-card">
//                 <h3>{match.Name}</h3>
//                 <p>Email: {match.Email}</p>
//                 <p>Experience: {match["How many years of experience do you have in entrepreneurship?"]} years</p>
//                 <p>Business Stage: {match["What stage is your current business in?"]}</p>
//                 <p>Risk Tolerance: {match["How risk-tolerant are you in business decisions? (Scale of 1-5)"]}</p>
//                 <p>Funding Experience: {match["Do you have experience in securing funding?"]}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       <style jsx>{`
//         .container {
//           text-align: center;
//           padding: 20px;
//           font-family: 'Poppins', sans-serif;
//         }
//         .header {
//           background: linear-gradient(45deg, #ff758c, #ff7eb3);
//           padding: 30px;
//           color: white;
//           border-radius: 15px;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
//         }
//         .input-container {
//           margin: 20px 0;
//         }
//         input {
//           padding: 10px;
//           width: 300px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//           font-size: 16px;
//         }
//         button {
//           margin-left: 10px;
//           padding: 10px 20px;
//           background-color: #ff758c;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//         }
//         .matches {
//           margin-top: 30px;
//         }
//         .matches-list {
//           display: flex;
//           flex-wrap: wrap;
//           justify-content: center;
//         }
//         .match-card {
//           background: white;
//           padding: 15px;
//           margin: 10px;
//           border-radius: 10px;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EntreConnect;

import React, { useState } from 'react';
import Swal from 'sweetalert2';

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
        title: 'Missing Name',
        text: 'Please enter your name!',
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
    <div className="container">
      <header className="header">
        <h1>EntreConnect</h1>
        <p>Find like-minded entrepreneurs with our AI-driven matching system!</p>
      </header>

      <div className="form-container">
        <button onClick={openGoogleForm}>Fill the Form</button>
        <input 
          type="text" 
          placeholder="Enter your Email" 
          value={name} 
          onChange={handleNameChange} 
          disabled={loading} 
        />
        <button onClick={generateMatches} disabled={loading}>
          {loading ? 'Generating Matches...' : 'Find Matches'}
        </button>
      </div>

      {matches.length > 0 && (
        <section className="matches">
          <h2>Your Matches</h2>
          <div className="match-list">
            {matches.map((match, idx) => (
              <div key={idx} className="match-card">
                <h3>{match.Name}</h3>
                <p>Email: {match["Email"]}</p>
                <p>Experience: {match["How many years of experience do you have in entrepreneurship?"]} years</p>
                <p>Age Group: {match["What is your age-group?"]}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          text-align: center;
          padding: 20px;
          background-color: #1C3334;
          color: #DA7B93;
        }
        .header {
          background: #2F4454;
          padding: 20px;
          color: white;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .form-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        input {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #DA7B93;
          background: #376E6F;
          color: white;
        }
        button {
          background: #2E151B;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #DA7B93;
        }
        .matches {
          margin-top: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .match-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
        }
        .match-card {
          background: #2F4454;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 250px;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default EntreConnect;