import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import { useForm } from "react-hook-form"
import axios from 'axios';

import {ThemeProvider, Box, Typography, FormControl, OutlinedInput, InputLabel, InputAdornment, IconButton  } from '@mui/material';

import {ThemeMain, ThemeCustom} from '../../style/Theme'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import ButtonSecondary from "../buttons/Button-secondary";
import logo from '../../assets/logo-light.png'


// const BaseUrl = 'http://localhost:3500/api';
const BaseUrl = 'https://trakiify-be.onrender.com/api';

const SignInForm = (props) =>{

    const [showPassword, setShowPassword] = useState(false);
    const {register, handleSubmit, watch, formState: { errors },} = useForm()
    const [token, setToken] = useState('')
    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // useEffect(()=>{
    //     alert(token)
    //     if(token !== ''){
            
    //     }
    // },[token])
      
    const onSubmit = (data) =>{
        console.log('submit');
        console.log(data)

        axios.post(`${BaseUrl}/user/login`,data,{
            headers: { 
                'Content-Type': 'application/json', 
              }
        })
        .then((response) => {
            console.log('axios',response);
            setToken(response.data.token)
            localStorage.setItem('token', response.data.token)
            navigate('/')
          })
          .catch((error) => {
            console.log(error);
            //alert(error.response.data.error)
            props.setErrorAlertOpen(true)
            props.setErrorText(error.response.data.error)
        });

    }

    return(
        <ThemeProvider theme={ThemeCustom}>
            <div className="flex justify-center items-center min-h-[100vh]">
                <Box component='form' onSubmit={handleSubmit(onSubmit)} className="max-w-[35rem] sm:max-w-[30rem] sm:px-9 py-8 sm:py-16 px-6 sm:border sm:border-taupe-gray sm:border-solid rounded-2xl">
                    <Typography variant="logo" component='div' className="flex mb-8 items-center justify-center">
                        <img src={logo} alt="Trakiify logo" className="w-[2rem] h-[2rem]"/>
                        rakiify
                    </Typography>
                    <FormControl fullWidth variant="standard"  >
                        <InputLabel shrink htmlFor="userEmail">Email</InputLabel>
                        <OutlinedInput
                            id="userEmail"
                            placeholder="Enter your email"
                            type='email'
                            {...register("email", { required: 'Email is required', pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email address'} 
                            })}
                        />
                        {errors.email && <div className="text-red text-sm mt-4">{errors.email.message}</div>}
                    </FormControl>
                    <FormControl fullWidth variant="standard">
                        <InputLabel shrink htmlFor="userPassword">Password</InputLabel>
                        <OutlinedInput
                            id="userPassword"
                            placeholder="Enter your password"
                            type={showPassword ? 'text' : 'password'}
                            {...register("password", { required: true})}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                        {errors.password && <div className="text-red text-sm mt-4">Password is required</div>}
                    </FormControl>
                    <ButtonSecondary type='submit' name='Sign In' class='w-full mt-6'/>
                    <div className="text-sm text-taupe-gray text-center mt-6 font-medium">
                        Don't have an account? <Link to={'/signup'} className="text-secondary">Sign Up</Link>
                    </div>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default SignInForm;