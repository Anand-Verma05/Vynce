import {Routes,  Route, Navigate } from "react-router-dom"
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import FriendsPage from './pages/FriendsPage.jsx'
import MyFriendsPage from './pages/MyFriendsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CreatePostPage from './pages/CreatePostPage.jsx'
import SavedPostsPage from './pages/SavedPostsPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import { Toaster } from "react-hot-toast"
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'
const App = () => {

  const {isLoading,authUser}=useAuthUser();
  const {theme}=useThemeStore();
  const isAuthenticated=Boolean(authUser);

  // console.log(data);

  if(isLoading) return <PageLoader/>;

  return (
    <div className=' h-screen' data-theme={theme}>
      {/* <button onClick={()=>toast.success("hello world")}>create toast</button> */}
        <Routes>
          <Route path="/" element={isAuthenticated ?(
            <Layout showSidebar={true}>
            <HomePage/>
            </Layout>):(
            <Navigate to="/login"/>
          ) }/>
          <Route path="/signup" element={!isAuthenticated?<SignUpPage/>:<Navigate to="/"/>}/>
          <Route path="/login" element={!isAuthenticated?<LoginPage/>:<Navigate to="/"/>}/>
          <Route path="/explore" element={isAuthenticated?<Layout showSidebar={true}><FriendsPage/></Layout>:<Navigate to="/login"/>}/>
          <Route path="/friends" element={isAuthenticated?<Layout showSidebar={true}><MyFriendsPage/></Layout>:<Navigate to="/login"/>}/>
          <Route path="/profile" element={isAuthenticated?<Layout showSidebar={true}><ProfilePage/></Layout>:<Navigate to="/login"/>}/>
          <Route path="/profile/:username" element={isAuthenticated?<Layout showSidebar={true}><UserProfilePage/></Layout>:<Navigate to="/login"/>}/>
          <Route path="/create-post" element={isAuthenticated?<Layout showSidebar={true}><CreatePostPage/></Layout>:<Navigate to="/login"/>}/>
          <Route path="/saved-posts" element={isAuthenticated?<Layout showSidebar={true}><SavedPostsPage/></Layout>:<Navigate to="/login"/>}/>

          <Route path="/notifications" element={isAuthenticated?(
            <Layout showSidebar={true}>
            <NotificationsPage/>
            </Layout>

          ):(
            <Navigate to ="/login"/>
          )}/>
          
          <Route path="/call/:id" element=
            { 
              isAuthenticated?(<CallPage/>):(
                <Navigate to ="/login"/>
              )
              

            }
          />


          <Route path="/chat/:id" element={isAuthenticated?(<Layout showSidebar={false}><ChatPage/></Layout>):<Navigate to ="/login" />}/>
          
          



        </Routes>
    <Toaster/>
    </div>
  )
}

export default App