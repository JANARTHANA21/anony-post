import { Routes, Route } from 'react-router-dom';
import LoginPage from "../pages/LoginPage";
import PostsUI from "../pages/PostsUI";
import Eachpost from '../components/Eachpost';
import RegisterPage from '../pages/RegisterPage';
import EditPostPage from '../pages/EditPost'; 
import PrivateRoute from "../components/PrivateRoute";
import useAutoLogin from '../hooks/useAutoLogin';

function App() {
  useAutoLogin();
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/posts" element={<PostsUI />} />
        <Route path="/posts/:id" element={<Eachpost />} />
        <Route path="/edit-post/:id" element={<EditPostPage />} />
      </Route>
    </Routes>
  );
}

export default App;