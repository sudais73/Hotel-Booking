import axios from 'axios'
import { createContext, useEffect } from 'react';
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import toast from 'react-hot-toast'


export const AppContext = createContext();

const AppProvider = ({children}) => {
  const navigate = useNavigate();
  const {user} = useUser();
  const {getToken} = useAuth();
  const [isOwner, setIsOwner] = useState(false)
  const [showHotelReg, setShowHotelReg] = useState(false)
  const [recentSearchedCities, setRecentSearchedCities] = useState([])

  const fetchUser = async() => {
    try {
      const {data} = await axios.get('/api/user', {
        headers: {Authorization: `bearer ${await getToken()}`}
      });

      if(data.success) {
        setIsOwner(data.role === 'hotelOwner')
        setRecentSearchedCities(data.recentSearchedCities)
      } else {
        setTimeout(() => {
          fetchUser();
        }, 5000)
      }
      console.log(data)
    } catch (error) {
      console.log(error.message)
      toast.error('Cannot get the user')
    }
  }

  useEffect(() => {
    if(user) {
      fetchUser();
      
    }
  }, [user])
  useEffect(()=>{
getToken().then((token)=>console.log(token))
  },[])

  const value = {
    navigate, 
    user,
    getToken, 
    isOwner,
    setIsOwner, 
    showHotelReg,
    setShowHotelReg,
    axios, 
    recentSearchedCities, 
    setRecentSearchedCities
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}


export default AppProvider;