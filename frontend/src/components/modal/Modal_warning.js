import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';

import {ThemeProvider, FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch, InputLabel, OutlinedInput } from '@mui/material';

import ButtonSecondary from "../buttons/Button-secondary";
import ButtonJet from "../buttons/Button-jet";

import {ThemeMain, ThemeCustom} from '../../style/Theme'
import modalStyle from './Modal.module.scss'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const WarningModal = ({warningModalOpen}) => {

    const navigate = useNavigate()





    return(

        <ThemeProvider theme={ThemeCustom}>
            <Dialog open={warningModalOpen}  >
                <div className={modalStyle['dialog-container']}>
                    <form>
                        <DialogTitle  className={modalStyle['dialog-title']}> <ErrorOutlineIcon fontSize="large" sx={{ fill: '#F09917' }}/> Your session has expired</DialogTitle>
                        <DialogContent >
                            <DialogContentText>
                                Please sign in again to continue using the app.
                            </DialogContentText>

                        </DialogContent>
                        <DialogActions>
                            <ButtonSecondary type='submit' name='Sign in' onClick={()=>{navigate('/signin')}} class={modalStyle['dialog-btn']}/>
                        </DialogActions>
                    </form>
                </div>
            </Dialog>
        </ThemeProvider>

    )
}

export default WarningModal;