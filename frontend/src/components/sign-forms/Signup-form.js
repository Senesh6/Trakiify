import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import { useForm } from "react-hook-form"
import axios from 'axios';

import {ThemeProvider, Box, Typography, FormControl, OutlinedInput, InputLabel, InputAdornment, IconButton, Select, MenuItem } from '@mui/material';

import {ThemeMain, ThemeCustom} from '../../style/Theme'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../../assets/logo-light.png'


import ButtonSecondary from "../buttons/Button-secondary";

const routeArr = [
                    {id:1, routeName:'Galle Road', routeVal:'RT001'},
                    {id:2, routeName:'Maharagama', routeVal:'RT002'},
                    {id:3, routeName:'Gampaha', routeVal:'RT003'}
                ]

// const BaseUrl = 'http://localhost:3500/api';
const BaseUrl = 'https://trakiify-be.onrender.com/api';



const SignUpForm = (props) =>{

    const [busRoute, setBusRoute] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {register, handleSubmit, watch, formState: { errors },} = useForm()
    const navigate = useNavigate()
    const [token, setToken] = useState('')

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    useEffect(()=>{console.log('busRoute', busRoute)},[busRoute])

    const handleChange = (e) => {
        setBusRoute(e.target.value);
        console.log('handleChange')
    };

    const onSubmit = (data) =>{
        console.log('submit');
        console.log('data',data)

        const formData = {
            ...data,
            team: 'Layup',
        };

        console.log(formData)

        axios.post(`${BaseUrl}/user/signup`,formData,{
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
                <Box component='form' onSubmit={handleSubmit(onSubmit)} className="max-w-[35rem] sm:max-w-[30rem] sm:my-8 sm:px-9 px-6 py-8 sm:py-16 sm:border sm:border-taupe-gray sm:border-solid rounded-2xl">
                    <Typography variant="logo" component='div' className="flex mb-8 items-center justify-center">
                        <img src={logo} alt="Trakiify logo" className="w-[2rem] h-[2rem]"/>
                        rakiify
                    </Typography>
                    <FormControl fullWidth variant="standard"  >
                        <InputLabel shrink htmlFor="fName">Full Name</InputLabel>
                        <OutlinedInput
                            id="fullName"
                            placeholder="Enter your Full name"
                            type='text'
                            {...register("fullName", { required: true})}
                            />
                            {errors.fullName && <div className="text-red text-sm mt-4">Name is required</div>}
                    </FormControl>
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
                            {...register("password", { required: true})}
                        />
                        {errors.password && <div className="text-red text-sm mt-4">Password is required</div>}
                    </FormControl>
                    {/* <FormControl fullWidth variant="standard">
                        <InputLabel shrink htmlFor="userPasswordConfirm">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="userPasswordConfirm"
                            placeholder="Confirm your password"
                            type={showPassword ? 'text' : 'password'}
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
                    </FormControl> */}
                    <FormControl fullWidth >
                    <InputLabel shrink id="route-label">Transit Route</InputLabel>
                    <Select
                        labelId="route-label"
                        id="route-select"
                        value={busRoute}
                        displayEmpty
                       
                        {...register("route", { required: true, onChange: (e) => handleChange(e)})}
                    >   
                        <MenuItem value=''>Select your transit route</MenuItem>
                    {routeArr.map((route, i)=>(
                        <MenuItem key={i} value={route.routeVal}>{route.routeName}</MenuItem>
                    ))
                    }    
                    </Select>
                    {errors.route && <div className="text-red text-sm mt-4">Transit route is required</div>}
                    </FormControl>
                    <ButtonSecondary type='submit' name='Sign Up' class='w-full mt-6'/>
                    <div className="text-sm text-taupe-gray text-center mt-6 font-medium">
                        Already have an account? <Link to={'/signin'} className="text-secondary">Sign In</Link>
                    </div>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default SignUpForm;