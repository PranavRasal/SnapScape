import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store'
import { RouterProvider , createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import allPost from './pages/allPost'
import  addPost  from './pages/addPost'
import editPost from './pages/editPost'
import Post from './pages/Post'
import { AuthLayout , Login , Signup } from './components/index.js'

const router = createBrowserRouter([
{
  path : "/" ,
  element : <App />,
  children : [
      {
          path : "/" ,
          element : <Home />
      },
      {
        path : "/login" ,
        element : (
          <AuthLayout authauthenticated={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path : "/signup" ,
        element : (
          <AuthLayout authenticated={false}>  
            <Signup />
          </AuthLayout>
        ),
      },{
        path : "/all-posts" ,
        element : (
          <AuthLayout authenticated={true}>
            <allPost />
          </AuthLayout>
        ),
      },
      {
        path : "/add-post" ,
        element : (
          <AuthLayout authenticated={true}>
            < addPost />
          </AuthLayout>
        ),
      },
      {
       path: "/edit-post/:slug",
            element: (
                <AuthLayout authenticated={true}>
                    {" "}
                    <editPost />
                </AuthLayout>
            ),
      },
      {
          path: "/post/:slug",
            element: <Post />,
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
