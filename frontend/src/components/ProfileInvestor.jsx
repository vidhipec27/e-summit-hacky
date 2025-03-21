import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ProfileInvestors.css';

const ProfileInvestors = () => {
    const { email } = useParams(); // Extract email from route params
    const [userProfile, setUserProfile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/userProfile?email=${email}`); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                setUserProfile(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUserProfile({
                    username: 'Guest',
                    emailid: 'guest@example.com',
                    password: 'password',
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
    }, [email]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!userProfile) {
        return <p>Profile not found.</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1 className="profile-title">✨ Your Profile ✨</h1>

                <div className="profile-form-group">
                    <label className="profile-label">👤 Username:</label>
                    <p className="profile-value">{userProfile.username || 'Not available'}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">📧 Email:</label>
                    <p className="profile-value">{userProfile.emailid || 'Not available'}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">🔒 Password:</label>
                    <div className="password-container">
                        <p className="profile-value">
                            {showPassword ? userProfile.password : '••••••'}
                        </p>
                        <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">📞 Phone Number:</label>
                    <p className="profile-value">{userProfile.number || 'Not available'}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">💼 Domain:</label>
                    <p className="profile-value">{userProfile.domain || 'Not available'}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">📊 Experience:</label>
                    <p className="profile-value">{userProfile.experience || 'Not available'} years</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">🛠 Expertise:</label>
                    <p className="profile-value">{userProfile.expertise || 'Not available'}</p>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">💰 Willing to Fund:</label>
                    <p className="profile-value">
                        {userProfile.willFund === 1 ? 'Yes' : 'No'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileInvestors;
