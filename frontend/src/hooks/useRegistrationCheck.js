import { useState, useEffect } from 'react';
import { BASE_URL } from '../helper';

export const useRegistrationCheck = (role) => {
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        console.log(`Checking registration for role: ${role}`);
        const token = localStorage.getItem("token");
        console.log("Token exists:", !!token);
        
        if (!token) {
          console.log("No token found");
          setIsComplete(false);
          setLoading(false);
          return;
        }

        console.log(`Making request to: ${BASE_URL}/auth/${role}/checkregistration`);
        const response = await fetch(`${BASE_URL}/auth/${role}/checkregistration`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log("Response data:", data);
          setIsComplete(data.registered || false);
        } else {
          console.log("Response not ok, status:", response.status);
          const errorText = await response.text();
          console.log("Error response:", errorText);
          setIsComplete(false);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
        setIsComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
  }, [role]);

  return { isComplete, loading };
}; 