import React from 'react'
import Navbar from './Component/Navbar'
import Footer from './Component/Footer'
import { Outlet } from 'react-router'

import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUser } from './userSlice.jsx'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants.js'

const Body = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
  useEffect(() => {
   
    const response=async()=>{
      try{

        const res=await axios.get(`${BASE_URL}/profile/view`,{
          withCredentials:true,
        })
        dispatch(addUser(res.data.data));
      }

      
      catch(err){
        navigate("/login");
      }

    }
    response();

    
  }, [])
  return (

    
    <div className=''>
      <Navbar/>

      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Body
