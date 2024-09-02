import React, {useEffect, useState} from "react";
import moment from 'moment';

import {ThemeProvider, Typography, Container } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import EditModal from "../modal/Modal_edit";

import {ThemeMain, ThemeCustom} from '../../style/Theme';
import './DNU-calender.scss';



const CalendarDNU = (props) =>{

    const [editDialog, setEditDialog] = useState(false);
    const [selDate, setSelDate] = useState('');

    const dateChange = (date) =>{
        console.log(date.format('MMMM DD YYYY'))
        setSelDate(date.format('MMMM DD YYYY'))
        setEditDialog(true);
    }

    useEffect(()=>{
        console.log(moment().format('YYYY-MM-DD'))
    },[])

    return(
        <>
        <EditModal open={editDialog} handleClose={setEditDialog} selDate={selDate}/>
        <ThemeProvider theme={ThemeCustom}>
            <div className='flex justify-center sm:items-center sm:pt-20 pt-12 calender-wrapper'>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-us">
                    <DateCalendar readOnly={!props.mode} defaultValue={moment('2023-04-15')}  onChange={dateChange} views={['day']} />
                </LocalizationProvider>
            </div>
        </ThemeProvider>
        </>
    );
}

export default CalendarDNU;