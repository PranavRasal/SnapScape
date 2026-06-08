import React from 'react'
import{Container , Logo , LogoutBtn } from '../index'
import{ Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/themeContext'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const navItems = [
    {
      name: "Home", 
      slug: "/",
      active: true,
    },
    {
      name : "Login",
      slug : "/login",
      active:!authStatus,
    },
    {
      name : "signup",
      slug : "/signup",
      active:!authStatus,
    },
    {
      name : "My Posts",
      slug : "/all-posts",
      active:authStatus,
    },
    {
      name :"Create Post",
      slug : "/create-post",
      active:authStatus,
    },
  ]
  return (
    <header className='py-3 shadow-sm bg-[var(--surface)] border-b border-[var(--border)] text-[var(--text)] transition-colors duration-300'>
      <Container>
        <nav className='flex items-center gap-3'>
         <div className='mr-4'>
         <Link to="/">
         <Logo width='70px'/>
         </Link>
         </div>
         <ul className='flex items-center gap-2 ml-auto'>
          {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                  className='inline-block px-5 py-2 rounded-full duration-200 hover:bg-[var(--surface-2)] text-[var(--text)]'
                >{item.name}</button>
              </li>
            ): null)}
            <li>
              <button
                type="button"
                onClick={toggleTheme}
                className='inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors duration-200 hover:opacity-90'
                aria-label="Toggle color mode"
              >
                <span>{isDark ? 'Light' : 'Dark'}</span>
                <span>{isDark ? '☀' : '☾'}</span>
              </button>
            </li>
            {authStatus && (
              <li>
                <LogoutBtn/>
                </li>
                )}
         </ul>
        </nav>
      </Container>
    </header>
    
  )
}

export default Header
