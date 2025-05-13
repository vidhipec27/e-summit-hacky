import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../helper';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ProfileEntre.css';
import { getFromBackend, postToBackend } from '../store/fetchdata';
import {jwtDecode} from "jwt-decode";

const ProfileEntre = () => {
    const { emailid } = useParams(); // Extract email from route params
    const [userProfile, setUserProfile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rating, setRating]=useState(0);
    const [isRated, setIsRated]=useState(false);
    const [loading, setLoading] = useState(true);
    const jwtToken=localStorage.getItem("token");
    const token=jwtDecode(jwtToken);
    useEffect(() => {
        const fetchUserProfile = async () => {
            
            //console.log("uhm",token.emailid);
           
            try {
                console.log(emailid);
                const response = await getFromBackend(`${BASE_URL}/search/entre/details/${emailid}`);
                console.log("something something", response);
                setUserProfile(response.data.result[0]);
                 setIsRated(response.data.result[0].feedback.some(feedback => feedback.investorId === token.emailid)); // Check if this investor has already rated
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUserProfile({
                    username: 'Guest',
                    emailid: 'guest@example.com',
                    number: '0000000000',
                    needFunding: 0,
                    startupStage: 'Idea',
                    experience: '<3',
                    teamSize: '<10',
                    averageRating:0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [emailid]); // Corrected dependency array

    const handleRatingSubmit = async () => {
        if (rating === 0) {
            alert('Please select a rating!');
            return;
        }

        const feedbackData = {
            investorId: token.emailid, // Get the current investor's ID
            rating,
        };

        try {
            const resp=await postToBackend(`${BASE_URL}/addFeedback/${emailid}`, feedbackData);
            alert('Thank you for your rating!');
            console.log(resp.data);
            const updatedProfile=resp.data.entre;
            setUserProfile(updatedProfile);
            setIsRated(true); // Mark as rated
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit your rating.');
        }
    };


    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!userProfile) {
        return <p>Profile not found.</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">

                <div className="profile-form-group">
                    <label className="profile-label">👤 Username:</label>
                    <p className="profile-value">{userProfile.username || 'Not available'}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">📧 Email:</label>
                    <p className="profile-value">{userProfile.emailid || 'Not available'}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">📞 Phone Number:</label>
                    <p className="profile-value">{userProfile.number || 'Not available'}</p>
                </div>
                
                <div className="profile-form-group">
                    <label className="profile-label">💰 Need Funding?:</label>
                    <p className="profile-value">
                        {userProfile.needFunding === 1 ? 'Yes' : 'No'}
                    </p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">📊 Startup Stage:</label>
                    <p className="profile-value">{["Idea", "MVP", "Launched", "Revenue Generating"][userProfile.startupStage]}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">🛠 Team size:</label>
                    <p className="profile-value"> {["<10", "10-25", "25-50", "50-100", "100+"][userProfile.teamSize]}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Experience</label>
                    <p className="profile-value"> {["<3", "3-6", "6-12", "12+"][userProfile.experience]} months</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label"> Average Rating:</label>
                    <p className="profile-value">{userProfile.averageRating || 'Be the first to rate them!'}</p>
                </div>

                {!isRated && (
                    <div className="rating-container">
                        <label className="profile-label">Rate this Entrepreneur:</label>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${rating >= star ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <button onClick={handleRatingSubmit}>Submit Rating</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProfileEntre;
