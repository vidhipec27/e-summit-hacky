import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const getFromBackend = async (link) => {
    try {
      const token = localStorage.getItem('token'); // Ensure token is retrieved
      if (!token) {
        throw new Error('No token found in localStorage');
      }
  
      const response = await axios.get(link, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response; // Return the full Axios response object
    } catch (error) {
      console.error('Request Error:', error.response ? error.response.data : error.message);
      throw error; // Rethrow to allow handling at the calling site
    }
  };
  
  export const postToBackend=async(link,data)=>{
    try{
      const token=localStorage.getItem("token");
      if(!token){
        return Error('Token not found')
      }
      const response=await axios.post(link, data,{
        headers:{'Authorization':`Bearer${token}`,
                  'Content-Type':'application/json'
      },
    });
      return response;
    }
    catch(error){
      console.error('Request Error:', error.response ? error.response.data : error.message);
      throw error; // Rethrow to allow handling at the calling site
    }
  };

  export const patchToBackend=async(link,data)=>{
    try{
      const token=localStorage.getItem("token");
      if(!token){
        return Error('Token not found')
      }
      const response=await axios.patch(link, data,{
        headers:{'Authorization':`Bearer${token}`,
                  'Content-Type':'application/json'
      },
    });
      return response;
    }
    catch(error){
      console.error('Request Error:', error.response ? error.response.data : error.message);
      throw error; // Rethrow to allow handling at the calling site
    }
  };