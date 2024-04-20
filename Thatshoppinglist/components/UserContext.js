import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import JWT from 'expo-jwt';
import {URL,JWT_SECRET} from '../config.js'



export const UserContext = createContext();

export const Provider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [ message, setMessage ] = useState('');
  const [registered, setRegistered] = useState('logIn')
  const [form, setForm] = useState({
    email: '',
    password: '',
    password2: ''
  });

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem('token', data);
    } catch (error) {
      console.error(error);
    }
  };


  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      setToken(value);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteData = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      setIsLoggedIn(false)

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const verify_token = async () => {
      try {
        if (!token) {
          setIsLoggedIn(false);
        } else {
          axios.defaults.headers.common['Authorization'] = token;
          const response = await axios.post(`${URL}/users/verify_token`);
          let decodedToken = JWT.decode(token, JWT_SECRET);
          setCurrentUser(decodedToken.userEmail);
          return response.data.ok ? setIsLoggedIn(true) : setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    verify_token();
  }, [token]);

  useEffect(() => {
    retrieveData();
  }, [token]);

  const register = async (e) => {
    try {
      const response = await axios.post(`${URL}/users/register`, {
        email: form.email,
        password: form.password,
        password2: form.password2
      });
      setMessage(response.data.message);
      setTimeout(()=>{setMessage('')},5000)
      if (response.data.ok) {
        console.log('Server says sign up ok')
      }
    } catch (error) {
      console.error(error);
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(`${URL}/users/login`, {
        email: form.email,
        password: form.password,
      });
      setMessage(response.data.message);
      if (response.data.ok) {
        let decodedToken = JWT.decode(response.data.token, JWT_SECRET, { timeSkew: 30 });
        console.log("Email extracted from the JWT token after login from App.js: ", decodedToken.userEmail);
        storeData(response.data.token);
        setCurrentUser(decodedToken.userEmail);
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  

  const logout = () => {
    deleteData();
  };

  const handleSwitch = () => {
    setRegistered((prevValue) => (prevValue === 'logIn' ? 'registered' : 'logIn'));
  };


  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn, storeData, retrieveData, deleteData, register, login, logout, handleSwitch, form, setForm, message, setMessage, registered, setRegistered }}>
      {children}
    </UserContext.Provider>
  );
};
