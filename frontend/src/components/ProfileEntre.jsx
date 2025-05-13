import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../helper';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ProfileEntre.css';
import { getFromBackend } from '../store/fetchdata';

const ProfileEntre = () => {
    const { emailid } = useParams(); // Extract email from route params
    const [userProfile, setUserProfile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log(emailid);
                const response = await getFromBackend(`${BASE_URL}/search/entre/details/${emailid}`);
                console.log("something something", response);
                setUserProfile(response.data.result[0]);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUserProfile({
                    username: 'Guest',
                    emailid: 'guest@example.com',
                    number: '0000000000',
                    domain: 'General',
                    experience: 0,
                    expertise: 'None',
                    willFund: 0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [emailid]); // Corrected dependency array

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
                    <label className="profile-label"> Feedback:</label>
                    <p className="profile-value">{userProfile.feedback || 'Be the first to rate them!'}</p>
                </div>

            </div>
        </div>
    );
};

export default ProfileEntre;
