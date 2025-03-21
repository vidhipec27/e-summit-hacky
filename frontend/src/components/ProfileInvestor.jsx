import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../helper';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ProfileInvestors.css';
import { postToBackend } from '../store/fetchdata';

const ProfileInvestors = () => {
    const { emailid } = useParams(); // Extract email from route params
    const [userProfile, setUserProfile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log(emailid);
                const response = await postToBackend(`${BASE_URL}/search/investor/details`, {emailid: emailid});
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
