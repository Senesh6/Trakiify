import React, {useEffect, useState} from "react";

import Calendar from 'react-calendar';
import {ThemeProvider, Typography, Container } from '@mui/material';


import {ThemeMain, ThemeCustom} from '../../style/Theme';
import './calender.scss';

const CalendarComp = (props) => {
    
  const [dateDisable, seDateDisable] = useState([]);
  const [minDate, setMindate] = useState()

    useEffect(()=>{

        const today = new Date();
        let lastMonth;
        
        if(today.getDate() < 5){
          lastMonth = new Date(today.getFullYear(), today.getMonth() -1, 1);
        }
        else{
          lastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        }

        setMindate(lastMonth.getTime());

    },[])

    const dateChange = (date) =>{
        console.log('data xx', date.getDay(), date.getTime(), date)
        props.setSelDate(date)
        props.setHoliday(false)
        props.setShow(true)
        //setEditDialog(true);
        
    }

    const monthChange = (date) => {
      console.log('monthChange', date.activeStartDate, date.activeStartDate.getTime())
      props.getFirstAndLastDate(date.activeStartDate.getTime())
    }

    useEffect(()=>{
      
      let dateDisableArry = [];
      console.log(' props.calendarData************************************',  props.calendarData)
      props.calendarData && props.calendarData.map((data) => {
       // console.log('map', data)
        
        if (data.status == 0) {
          dateDisableArry.push(JSON.parse(data.date));
          seDateDisable(dateDisableArry);
        }
        
      });  


    },[props.calendarData]);

    const titleContent = ({ activeStartDate, date, view }) => {
        // if (view == 'month' && (date.getDay() == 0 || date.getDay() == 6)) {
        //   return <p className="tag disabled"></p>;
        
        // }

        if(props.calendarData.length > 0){
      
          const tileContents = props.calendarData.map((data, key) => {

           //console.log('tileContents',data.status, date.getTime(), data.date )
            
            if (view == 'month' && date.getTime() == data.date) {
              //console.log('view == month && date.getTime() == data.date')
              if (data.status == 3) {
                //console.warn('3',data.date)
                return <p key={key} className="tag both"></p>;
              }
              if (data.status == 1) {
                //console.warn('1',data.date)
                return <p key={key} className="tag arrival"></p>;
              }
              if (data.status == 2) {
                //console.warn('2',data.date)
                return <p key={key} className="tag departure"></p>;
              }
              if (data.status == 0) {
                //console.warn('2',data.date)
                return <p key={key} className="tag disabled"></p>;
              }
              //console.log('else',data.date)
              return;
            }
            //console.log('nulll')
            return null;
          });
          //console.log('tileContents func')
          return tileContents.length > 0 ? tileContents : null;

        }
    };



      const tileDisabled = ({ activeStartDate, date, view }) => {
        
        if(props.buttonDisable){
          //console.log('dateDisable ', dateDisable) 
          const disabledDates= dateDisable.map((data) => {
            //console.log('disabledDatesxxx', data) 
            return new Date(data).getDate() || date.getTime() < minDate;
          })
          
          //console.log('disabledDates',disabledDates, date.getDay());
          return disabledDates.includes(date.getDate()) || date.getDay() == 0 || date.getDay() == 6 || date.getTime() < minDate ;
        }
        else{
          return true || date.getTime() < minDate ;
        }
        
      }

      const clickMonth = (value) => {
        console.log('clickMonth',value)
      }

    return(
        <>
        <ThemeProvider theme={ThemeCustom}>
            <div className='calender-wrapper main-calender'>
                <Calendar 
                    onChange={dateChange} 
                    next2Label=''
                    prev2Label=''
                    tileClassName='test' 
                    tileContent={titleContent}
                    tileDisabled={tileDisabled}
                    showNeighboringMonth={false}
                    maxDate={new Date()}
                    onActiveStartDateChange={monthChange}
                />
            </div>
        </ThemeProvider>
        </>
    );
}

export default CalendarComp;