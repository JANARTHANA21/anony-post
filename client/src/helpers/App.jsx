import {Routes,Route, Router} from 'react-router-dom'
import LoginPage from "../pages/LoginPage"
import PostsUI from "../pages/PostsUI"
import Eachpost from '../components/Eachpost'
import RegisterPage from '../pages/RegisterPage'

function App() {
    return (
    <>
    <Routes >
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/posts' element={<PostsUI/>}/>
        <Route path='/posts/:id' element={<Eachpost/>}/>

    </Routes>
    </>
    )
}

export default App
