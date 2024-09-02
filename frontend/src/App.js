import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import {ThemeProvider, CssBaseline  } from '@mui/material';

import {ThemeMain, ThemeCustom} from './style/Theme'

import './style/style.scss';

import SignIn from './views/Signin';
import SignUp from './views/Signup';
import Home from './views/Home';
import Admin from './views/Admin';
import Navbar from './components/nav/Nav';

// const user = {name:'John Doe', accType:'Admin'}


const App = () => {

  const [navBar, setNavBar] = useState(false)
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [token, setToken] = useState('')

  useEffect(()=>{
    let tokenDecode;
    if(token !== ''){
        tokenDecode = decodeJWT(token);
        setUserName(tokenDecode.fullName)
        setUserRole(tokenDecode.role)
    }
    
    console.log(tokenDecode)

  },[token])

  const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  
    const payload = JSON.parse(jsonPayload);
    return payload;
}

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setNavBar(true);  
      break;
      case '/admin':
        setNavBar(true); 
        break;
      default:
        setNavBar(false); 
        break;
    }

    if(localStorage.getItem('token') !== null){
        setToken(localStorage.getItem('token'))
    }
    
  },[location])

  useEffect(()=>{
    if(localStorage.getItem('token') !== null){
      setToken(localStorage.getItem('token'))
    }
  },[])

  

  return (
    <ThemeProvider theme={ThemeMain}>
      <CssBaseline enableColorScheme/>
        { navBar &&
          <Navbar user={userName} role={userRole}/>
        }  
        <Routes>
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/' element={<Home user={userName} token={token}/>} />
          <Route path='/admin' element={<Admin user={userName} role={userRole} token={token}/>} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
