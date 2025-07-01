import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials, setRefreshingDone } from '../features/auth/authSlice';

const API_URL = import.meta.env.VITE_API_URL;

export default function useAutoLogin() {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { user, accessToken } = res.data;
        dispatch(setCredentials({ user, accessToken }));

      } catch (err) {
        dispatch(setRefreshingDone()); // done even on failure
      }
    };

    refreshAccessToken();
  }, [dispatch]);
}