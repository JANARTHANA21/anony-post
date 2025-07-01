import API from '../api/axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCredentials, logout } from '../features/auth/authSlice';
import axios from 'axios';

export default function useAuthAxios() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth?.accessToken);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const reqInterceptor = API.interceptors.request.use(
      async (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle expired access token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
              {},
              { withCredentials: true }
            );

            const newAccessToken = refreshRes.data.accessToken;

            dispatch(setCredentials({ user, accessToken: newAccessToken }));

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return API(originalRequest); // Retry original request
          } catch (refreshError) {
            // If refresh token is also invalid or expired
            dispatch(logout());
            toast.error('Session expired. Please login again.');
            navigate('/');
            return Promise.reject(refreshError);
          }
        }

        // If it's not a 401 or already retried
        toast.error(error.response?.data?.msg || 'Request failed');
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.request.eject(reqInterceptor);
      API.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken, dispatch, navigate, user]);

  return API;
}