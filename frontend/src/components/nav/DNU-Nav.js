import React, {useEffect, useState} from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'

import {ThemeProvider, AppBar, Container, Toolbar, Typography, IconButton, Avatar, Tooltip, Menu, MenuItem, Box  } from '@mui/material';

import {ThemeMain, ThemeCustom} from '../../style/Theme'
import NavStyle from './Nav.module.scss'

import LogoutIcon from '@mui/icons-material/Logout';
import SwapVertIcon from '@mui/icons-material/SwapVert';

import logo from '../../assets/logo-light.png'

const settings = ['Logout'];

const NavbarDNU = (props) =>{

    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [switchState, setSwitchState] = useState({text:'', link:''})

    const handleOpenUserMenu = (e) => {
        setAnchorElUser(e.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(()=>{
        switch (location.pathname){
            case '/':
                setSwitchState({text:'Switch to Admin', link:'/admin'});
            break;
            case '/admin':
                setSwitchState({text:'Switch to User', link:'/'});
            break;   
            default:
                setSwitchState({text:'', link:''});
            break;   
        }
    },[location])

    const isMobile = useMediaQuery({
        query: '(max-width: 600px)'
    })


    return(
        <ThemeProvider theme={ThemeCustom}>
            <AppBar position="fixed" className="shadow-none">
                <Container maxWidth="xl">
                    <Typography variant="logoNav" component='div' className="py-4 flex items-center">
                        <img src={logo} alt="TransApp logo" className="w-[2rem] me-3"/>
                        TransApp
                    </Typography>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
}

export default NavbarDNU;