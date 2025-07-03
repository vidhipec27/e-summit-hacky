import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../helper';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaChartLine, FaStar } from 'react-icons/fa';
import './ProfileInvestors.css';
import { postToBackend } from '../store/fetchdata';
import Navbar from "../components/Navbar";

const ProfileInvestor = () => {
    const { emailid } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await postToBackend(`${BASE_URL}/search/investor/details`, { emailid });
                setUserProfile(response.data.result[0]);
            } catch (error) {
                setUserProfile({
                    username: 'Guest',
                    emailid: 'guest@example.com',
                    number: '0000000000',
                    domain: 'General',
                    experience: 0,
                    expertise: 'None',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [emailid]);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading profile...</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="loading-state">
                <FaUser size={50} color="#00e5ff" />
                <p className="loading-text">Profile not found</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <h1 className="profile-title">{userProfile.username || 'Investor'}</h1>
                        <p className="profile-subtitle">Investor Profile</p>
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">
                            <span className="info-icon"><FaUser size={10} /></span>
                            Username
                        </label>
                        <p className="profile-value">{userProfile.username || 'Not available'}</p>
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">
                            <span className="info-icon"><FaEnvelope size={10} /></span>
                            Email
                        </label>
                        <p className="profile-value">{userProfile.emailid || 'Not available'}</p>
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">
                            <span className="info-icon"><FaPhone size={10} /></span>
                            Phone Number
                        </label>
                        <p className="profile-value">{userProfile.number || 'Not available'}</p>
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">
                            <span className="info-icon"><FaBriefcase size={10} /></span>
                            Domain
                        </label>
                        <p className="profile-value">{userProfile.domain || 'Not available'}</p>
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">
                            <span className="info-icon"><FaChartLine size={10} /></span>
                            Experience
                        </label>
                        <p className="profile-value">{userProfile.experience || 'Not available'} years</p>
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">
                            <span className="info-icon"><FaStar size={10} /></span>
                            Expertise
                        </label>
                        <p className="profile-value">{userProfile.expertise || 'Not available'}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileInvestor;
