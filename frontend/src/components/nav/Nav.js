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

const Navbar = (props) =>{

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

    const Logout = () => {
        handleCloseUserMenu();
        localStorage.removeItem('token')
        navigate('/signin')
    }

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

    useEffect(()=>{
        console.log('name', props.user);
    },[props.user])


    return(
        <ThemeProvider theme={ThemeCustom}>
            <AppBar position="fixed" className="shadow-none">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography variant="logoNav" component='div' className="py-4 flex items-center">
                            <img src={logo} alt="Trakiify logo" className="w-[2rem] h-[2rem]"/>
                            rakiify
                        </Typography>
                        <Box >
                            <div className='flex items-center'>
                                {!isMobile && switchState.link !== '' && props.role == "ADMIN" &&
                                <Link className="router-link" to={switchState.link}>
                                    <Typography component='div' variant="text20" className="mr-7 pr-7 border-r border-0 border-r-jet border-solid">
                                        {switchState.text}
                                    </Typography> 
                                </Link>
                                }
                                <Box onClick={handleOpenUserMenu} className='flex items-center cursor-pointer'>
                                    {/* <Typography component='div' variant="text20" className="mr-4 hidden sm:block">{props.user.split(" ")[0]}</Typography>    */}
                                    <Typography component='div' variant="text20" className="mr-4 hidden sm:block">{ props.user.split(" ") ?  props.user.split(" ")[0] : props.user}</Typography>   
                                    <Tooltip title="Open settings">
                                        <IconButton sx={{ p: 0 }}>
                                            {/* <Avatar alt={props.user.split(" ")[0]} src="/static/images/avatar/2.jpg" className="bg-[#4166ff]"/> */}
                                            <Avatar alt={props.user} src="/static/images/avatar/2.jpg" className="bg-[#4166ff]"/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </div>
                            <Menu
                            sx={{ mt: '2.8rem'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            >
                            {isMobile && switchState.link !== '' &&  props.role == 'ADMIN' &&
                                <MenuItem>
                                    <Link className="router-link" to={switchState.link}>
                                        <Typography component='div' textAlign="center" className={NavStyle['menuItem']}>
                                            <SwapVertIcon/>{switchState.text}
                                        </Typography> 
                                    </Link>
                                </MenuItem>
                            }    
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={Logout}>
                                    <Typography textAlign="center" component={'div'} className={NavStyle['menuItem']}>
                                        <LogoutIcon/>{setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
}

export default Navbar;