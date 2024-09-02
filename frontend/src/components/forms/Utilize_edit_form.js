import React, {useEffect, useState} from "react";
import { useMediaQuery } from 'react-responsive'

import {ThemeProvider, FormControl, Switch, InputLabel, OutlinedInput, IconButton } from '@mui/material';

import ButtonSecondary from "../buttons/Button-secondary";
import ButtonJet from "../buttons/Button-jet";

import {ThemeMain, ThemeCustom} from '../../style/Theme'
import modalStyle from './Form.module.scss'
import CloseIcon from '@mui/icons-material/Close';


const UtilizeEdit = (props) => {

    const [arrival, setArrival] = useState(false);
    const [departure, setDeparture] = useState(false);
    const [btnArrivalDisable, setBtnArrivalDisable] = useState(true);
    const [buttonDepartDisable, setButtonDepartDisable] = useState(true);
    const isMobile = useMediaQuery({ query: '(max-width: 900px)' })

    const selectDate = () => {
        const specificData = props.calendarData.find(data => props.selDate.getTime() == data.date);
        if(specificData !== undefined){
            if(specificData.status == 1){
                setArrival(true);
                setDeparture(false);
            }
            else if(specificData.status == 2){
                setDeparture(true);
                setArrival(false);
            }
            else if(specificData.status == 3){
                setArrival(true);
                setDeparture(true);
            }
            else{
                setArrival(false);
                setDeparture(false);
            }
        }
        else{
            setArrival(false);
            setDeparture(false);
        }

        props.setButtonDisable(true);
    }

    useEffect(()=>{
        selectDate();
        //console.log('edit',props.selDate.getTime(), specificData.status);

    },[props.selDate])


    useEffect(()=>{
        console.log('arrival',arrival, 'departure',departure);

        if(arrival && departure){
            props.setStatus(3);
        }
        else if(arrival && !departure){
            props.setStatus(1);
        }
        else if(!arrival && departure){
            props.setStatus(2);
        }
        else if(!arrival && !departure){
            props.setStatus(4);
        }
        else{
            props.setStatus(0);
        }

    },[arrival, departure])

    useEffect(()=>{

        console.log('btnArrivalDisable',btnArrivalDisable, 'buttonDepartDisable',buttonDepartDisable)

        if(!btnArrivalDisable || !buttonDepartDisable){
            props.setButtonDisable(false)
        }
        else{
            props.setButtonDisable(true);
        }

    },[btnArrivalDisable, buttonDepartDisable])


    const switchDefCancel = (e) =>{
        e.preventDefault();
        selectDate();
        setBtnArrivalDisable(true);
        setButtonDepartDisable(true);
    }

    const switchDefDone = (e) =>{
        e.preventDefault();
        props.setButtonDisable(true);
        props.setShow(false)
        props.postFormData();
        
    }

    const closeInMobile = (e) => {

        switchDefCancel(e)
        if(isMobile){
            props.setShow(false)
        }
    }

    const handleArrivalChange = (e) =>{
        console.log('checked arr', e.target.checked)
        setArrival(e.target.checked);
        const specificData = props.calendarData.find(data => props.selDate.getTime() == data.date);
        if(specificData !== undefined){
            if(specificData.status == 1 || specificData.status == 3){
                if(e.target.checked == false){
                    
                    setBtnArrivalDisable(false);
                }
                else{
                    setBtnArrivalDisable(true);
                }
            }
            else{
                if(e.target.checked == false){
                    setBtnArrivalDisable(true);
                }
                else{
                    setBtnArrivalDisable(false);
                }
            }
        }
        else{
            if(e.target.checked == false){
                setBtnArrivalDisable(true);
            }
            else{
                setBtnArrivalDisable(false);
            }
        }
    }

    const handleDepartureChange = (e) =>{
        console.log('checked dep', e.target.checked)
        setDeparture(e.target.checked);
        const specificData = props.calendarData.find(data => props.selDate.getTime() == data.date);
        if(specificData !== undefined){
            if(specificData.status == 2 || specificData.status == 3){
                if(e.target.checked == false){
                    
                    setButtonDepartDisable(false);
                }
                else{
                    setButtonDepartDisable(true);
                }
            }
            else{
                if(e.target.checked == false){
                        
                    setButtonDepartDisable(true);
                }
                else{
                    setButtonDepartDisable(false);
                }
            }
        }
        else{
            if(e.target.checked == false){
                    
                setButtonDepartDisable(true);
            }
            else{
                setButtonDepartDisable(false);
            }
        }
    }

    useEffect(()=>{
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        let dateAtDaystart = date.getTime();

        console.log('props.calendarData',props.calendarData)
        props.calendarData.map((day, index) => {
            console.log('holiday',day.date, day.status, dateAtDaystart)
            if(day.status == 0 && day.date == dateAtDaystart){
                props.setHoliday(true)
                console.log('holidayXX*****************************************')
            }
        })

    },[props.calendarData])

    useEffect(()=>{
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        let dateAtDaystart = date.getTime();
        
        if(date.getDay() == 0 || date.getDay() == 6){
            props.setHoliday(true) 
            console.log('holidayYY*****************************************')
        } 
    },[])


    return(
        <div className={`${modalStyle['utilize-wrapper']} relative`}>
            <IconButton onClick={(e)=>closeInMobile(e)} className="md:hidden block absolute right-0 top-[-16rem]" >
                <CloseIcon fontSize="large"/>
            </IconButton> 
            {props.holiday?(
                <div className="min-h-[12rem] flex flex-col justify-center">
                    <div className="text-white font-medium text-2xl mb-1">Today is a holiday! </div>
                    <div className="text-taupe-gray font-medium text-base ">Let the roads take a vacation while you enjoy yours.</div>
                </div>
            ):(
            <form>
                <FormControl fullWidth className={`${modalStyle['switch-wrapper']} hidden`}>
                    <InputLabel shrink htmlFor="editDate" className={modalStyle['switch-label']}>Select Date</InputLabel>
                    <OutlinedInput className={modalStyle['date-input']}
                        id="editDate"
                        type='text'
                        value={props.selDate.getTime()}
                        disabled
                    />
                </FormControl>
                <FormControl fullWidth className={modalStyle['switch-wrapper']}>
                    <InputLabel className={modalStyle['switch-label']}>Arrival</InputLabel>
                    <Switch checked={arrival} onChange={handleArrivalChange} inputProps={{ 'aria-label': 'Switch arrival' }}/>
                </FormControl>
                <FormControl fullWidth className={modalStyle['switch-wrapper']}>
                    <InputLabel className={modalStyle['switch-label']}>Departure</InputLabel>
                    <Switch checked={departure} onChange={handleDepartureChange} inputProps={{ 'aria-label': 'Switch departure' }}/>
                </FormControl>
                <div className="flex justify-end mb-5 mt-10">
                    <ButtonJet type='button' name={'Clear'} onClick={(e) => {switchDefCancel(e)}} class='me-3' disabled={props.buttonDisable}/>
                    <ButtonSecondary type='submit' name='Save' onClick={(e) => {switchDefDone(e)}} disabled={props.buttonDisable}/>
                </div>
            </form>    
            )}
        </div>
    )
}

export default UtilizeEdit;