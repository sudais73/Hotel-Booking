import React, { useContext, useState } from 'react'
import { assets, cities } from '../assets/assets'
import { AppContext } from './../context/AppContext';
import toast from 'react-hot-toast';

const HotelReg = () => {

    const{setShowHotelReg,axios,getToken, setIsOwner} = useContext(AppContext)

    const[name, setName] = useState("")
    const[address, setAddress] = useState("")
    const[contact, setContact] = useState("")
    const[city, setCity] = useState("")


   const onSubmitHandler = async(e) => {
  e.preventDefault();
  
  // Basic validation
  if (!name || !address || !contact || !city) {
    return toast.error('Please fill all fields');
  }

  try {
    const {data} = await axios.post('/api/hotel/add-hotel', 
    {
      name, 
      address, 
      contact, 
      city
    }, 
    {
      headers: {
        Authorization: `Bearer ${await getToken()}` 
      }
    });

    if(data.success) {
      toast.success(data.msg);
      setIsOwner(true);
      setShowHotelReg(false);
    
    } else {
      toast.error(data.msg || 'Hotel registration failed');
    }
  } catch (error) {
    // More detailed error handling
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Failed to register hotel';
    toast.error(errorMessage);
  }
};
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 items-center justify-center bg-black/70'>
        <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
            <img src={assets.regImage} alt="" className='w-1/2 rounded-xl hidden md:block' />
            <div className='relative flex flex-col items-center md: w-1/2 p-8 md:p-10'>
                <img onClick={()=>{setShowHotelReg(false), scrollTo(0,0)}} src={assets.closeIcon} alt="" className='absolute top-4 r-ght-4 h-4 w-4 cursor-pointer' />
                <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>
                {/* hotel name */}
                <div className='w-full mt-4'>
                        <label htmlFor="name" className='font-medium text-gray-500'>
                            Hotel Name
                        </label>
                        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" id='name' placeholder='Type here'
                        className='border border-gray-500 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required
                        />
                </div>
                    {/* contact */}
                <div className='w-full mt-4'>
                        <label htmlFor="contact" className='font-medium text-gray-500'>
                            Phone
                        </label>
                        <input value={contact} onChange={(e)=>setContact(e.target.value)} type="text" id='contact' placeholder='Type here'
                        className='border border-gray-500 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required
                        />
                </div>

                  {/* address */}
                <div className='w-full mt-4'>
                        <label htmlFor="address" className='font-medium text-gray-500'>
                            Address
                        </label>
                        <input value={address} onChange={(e)=>setAddress(e.target.value)} type="text" id='address' placeholder='Type here'
                        className='border border-gray-500 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required
                        />
                </div>
                        {/* city */}
                <div className='w-full mt-4 max-w-60 mr-auto'>
                        <label htmlFor="city" className='font-medium text-gray-500'>
                            City
                        </label>
                        <select value={city} onChange={(e)=>setCity(e.target.value)} name="" id="city" className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required>

                            <option value="">Select City</option>
                            {cities.map((city)=>(
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                </div> 
                 <button className='bg-indigo-500 hover:indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'
            >Register</button>
            </div>
           
        </form>
      
    </div>
  )
}

export default HotelReg
