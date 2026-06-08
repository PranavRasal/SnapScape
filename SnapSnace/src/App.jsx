import { useState , useEffect } from 'react'
import {useDispatch} from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import { ThemeProvider } from './context/themeContext'

function AppShell() {
 const[loading,setLoading] = useState(true)
 const dispatch = useDispatch()


 useEffect(()=>{
  authService.currentUser().then((userData)=>{
    if(userData){
    dispatch(login({userData}))
  }else{
    dispatch(logout())
  }
})
.finally(()=> setLoading(false))
 },[])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-[var(--page-bg)] text-[var(--text)] transition-colors duration-300'>
     <div className='w-full block'>
     <Header/>
    <main className='min-h-[calc(100vh-80px)]'>
     <Outlet/>
    </main>
   <Footer/>
  </div>
    </div>
  ) : (
    <div className="App">
      <h1>Loading...</h1>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

export default App
