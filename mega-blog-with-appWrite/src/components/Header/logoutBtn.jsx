import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = () => {
        authService.logout().then(()=>{
            dispatch(logout())
            navigate('/login', { replace: true })
        })
    }
  return (
    <div>
    <button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-white rounded'>Logout</button>
    </div>
  )
}

export default LogoutBtn
