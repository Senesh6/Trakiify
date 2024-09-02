import React, {useEffect, useState} from "react";

import {ThemeProvider, FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch, InputLabel, OutlinedInput } from '@mui/material';

import ButtonSecondary from "../buttons/Button-secondary";
import ButtonJet from "../buttons/Button-jet";

import {ThemeMain, ThemeCustom} from '../../style/Theme'
import modalStyle from './Modal.module.scss'

const EditModal = ({open, handleClose, selDate}) => {

    const [arrival, setArrival] = useState(false);
    const [departure, setDeparture] = useState(false);

    const switchDef = (e) =>{
        e.preventDefault();
        setArrival(false);
        setDeparture(false);
    }

    const handleArrivalChange = (e) =>{
        setArrival(e.target.checked)
    }

    const handleDepartureChange = (e) =>{
        setDeparture(e.target.checked)
    }

    return(

        <ThemeProvider theme={ThemeCustom}>
            <Dialog open={open}  >
                <div className={modalStyle['dialog-container']}>
                    <form>
                        <DialogTitle>Edit</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Update your transport utilization.
                            </DialogContentText>
                            <FormControl fullWidth className={modalStyle['dialog-switch-wrapper']}>
                                <InputLabel shrink htmlFor="editDate" className={modalStyle['dialog-switch-label']}>Select Date</InputLabel>
                                <OutlinedInput className={modalStyle['dialog-date-input']}
                                    id="editDate"
                                    type='text'
                                    value={selDate}
                                    disabled
                                />
                            </FormControl>
                            <FormControl fullWidth className={modalStyle['dialog-switch-wrapper']}>
                                <InputLabel className={modalStyle['dialog-switch-label']}>Arrival</InputLabel>
                                <Switch checked={arrival} onChange={handleArrivalChange} inputProps={{ 'aria-label': 'Switch arrival' }}/>
                            </FormControl>
                            <FormControl fullWidth className={modalStyle['dialog-switch-wrapper']}>
                                <InputLabel className={modalStyle['dialog-switch-label']}>Departure</InputLabel>
                                <Switch checked={departure} onChange={handleDepartureChange} inputProps={{ 'aria-label': 'Switch departure' }}/>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <ButtonJet type='button' name='Cancel' onClick={(e) => {handleClose(false); switchDef(e)}} class={modalStyle['dialog-btn']}/>
                            <ButtonSecondary type='submit' name='Done' onClick={(e) => {handleClose(false); switchDef(e)}} class={modalStyle['dialog-btn']}/>
                        </DialogActions>
                    </form>
                </div>
            </Dialog>
        </ThemeProvider>

    )
}

export default EditModal;