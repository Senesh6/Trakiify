import React, {useEffect, useState, useRef} from "react";
import axios from 'axios';
import { useMediaQuery } from 'react-responsive'

import {ThemeProvider, Typography, Container, Switch, InputLabel, Stack } from '@mui/material';
import SimpleBar from 'simplebar-react';

import {ThemeMain, ThemeCustom} from '../style/Theme'

import CalendarComp from "../components/calendar/calendar";
import UtilizeEdit from "../components/forms/Utilize_edit_form";
import 'simplebar-react/dist/simplebar.min.css';

import WarningModal from "../components/modal/Modal_warning";
import AlertSuccess from "../components/alert/Alert_success";
import AlertError from "../components/alert/Alert_error";

// const BaseUrl = 'http://localhost:3500/api';
const BaseUrl = 'https://trakiify-be.onrender.com/api';


// const calendarDataArray = [
//     {'date':1683052200000, 'status':1}, 
//     {'date':1683743400000, 'status':2},
//     {'date':1684175400000, 'status':3}, 
//     {'date':1684368000000, 'status':2},
//     {'date':1685471400000, 'status':2},
//     {'date':1684866600000, 'status':3}, 
//     {'date':1683225000000, 'status':0},
//     {'date':1692124200000, 'status':3}, 
//     {'date':1692297000000, 'status':0},
//     {'date':1693526400000, 'status':2}, 

//     ]

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const Home = (props) =>{

    const [calendarData, setCalendarData] = useState([])
    const [selDate, setSelDate] = useState(new Date());
    const [arrivalCount, setArrivalCount] = useState(0);
    const [departureCount, setDepartureCount] = useState(0);
    const [holidayCount, setHolidayCount] = useState(0);
    const [buttonDisable, setButtonDisable] = useState(true);
    const [holiday, setHoliday] = useState(false)
    const [monthFirstDay, setMonthFirstDay] = useState('')
    const [monthLastDay, setMonthLastDay] = useState('')
    const [userSummary, setUserSummary] = useState({})
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState();
    const isMobile = useMediaQuery({ query: '(max-width: 900px)' })
    const [token, setToken] = useState('')
    const [warningModalOpen, setWarningModalOpen] = useState(false)
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [successText, setSuccessText] = useState('Success! Your transport utilization has been updated.')
    const [errorText, setErrorText] = useState('Oops! Something went wrong. Please try again.')
    const [currentmonth, setCurrentmonth] = useState('')

    useEffect(()=>{
        if(successAlertOpen === true){
            setTimeout(()=>{
                setSuccessAlertOpen(false)
            },3000)
        }
    },[successAlertOpen])


    useEffect(()=>{
        if(errorAlertOpen === true){
            setTimeout(()=>{
                setErrorAlertOpen(false)
            },3000)
        }
    },[errorAlertOpen])


    useEffect(()=>{

        getFirstAndLastDate(selDate.getTime())
        
    },[])

    useEffect(()=>{

        console.log('home', props.token)
        if(props.token !== ''){
            setWarningModalOpen(false)
        }
        else{
            setWarningModalOpen(true)
        }
        
        setToken(props.token)
        
    },[props.token])


    useEffect(()=>{

        console.log('status', status)
        
    },[status])

    useEffect(()=>{
        console.log('holiday',holiday)
    },[holiday]);


    useEffect(()=>{

        if(monthFirstDay !== '' && monthLastDay !== ''){
            getTravelData();
            getTravelMonthSummary();
        }
        
    },[monthFirstDay,monthLastDay, token])


    const getTravelData = () => {

        console.log('getTravelData token',token)

        let data = JSON.stringify({
            "fromDate": monthFirstDay,
            "toDate": monthLastDay
        });

        axios.post(`${BaseUrl}/travel/getTravelData`,data,{
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
              }
        })
        .then((response) => {
            console.log('axios',response.data);
            setCalendarData(response.data)
          })
          .catch((error) => {
            console.log(error);
            // setErrorAlertOpen(true)
            // setErrorAlertOpen(error.response.data.error)
        });
    }

    const getTravelMonthSummary = () => {
        let data = JSON.stringify({
            "fromDate": monthFirstDay,
            "toDate": monthLastDay
        });

        axios.post(`${BaseUrl}/travel/getDayCountForUser`,data,{
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
              }
        })
        .then((response) => {
            console.log('axios',response.data,response.data.length );
            setUserSummary(response.data)
            
          })
          .catch((error) => {
            console.log('error',error);
            setUserSummary({})
            // setErrorAlertOpen(true)
            // setErrorText(error.response.data.error)
        });
    }

    const postFormData = () => {
        let data = JSON.stringify({
            "date": selDate.getTime(),
            "status": `${status}`
        });

        axios.post(`${BaseUrl}/travel/updateTravelStatus`,data,{
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
              }
        })
        .then((response) => {
            console.log('postFormData',response.data,response.data.length );
            //setCalendarData([...calendarData, response.data] )
            if(response.data.status !== 4){
                const updatedData = calendarData.filter((dateItem)=> dateItem.date !== response.data.date)
                setCalendarData([...updatedData, response.data])
            }
            else{
                const updatedData = calendarData.filter((dateItem)=> dateItem.date !== response.data.date)
                setCalendarData(updatedData)
            }
            
            setSuccessAlertOpen(true)
            setSuccessText('Success! Your transport utilization has been updated.')
            getTravelMonthSummary()
          })
          .catch((error) => {
            console.log('error',error);
            setErrorAlertOpen(true)
            setErrorText(error.response.data.error)
        });
    }

    useEffect(()=>{
        console.log('selDate xx',selDate.getTime());
    }
    ,[selDate]);

    useEffect(()=>{console.log('show ',show)},[show])

    useEffect(()=>{

        let arrivalCount = [];
        let departureCount = [];
        let holidayCount = [];

        calendarData.map((data) => {
            
            if (data.status == 1) {
                
                arrivalCount.push(data);
                
            }
            if (data.status == 2) {
                
                departureCount.push(data);
                
            }
            if (data.status == 3) {
                arrivalCount.push(data);
                departureCount.push(data);
            }
            if (data.status == 0) {
                holidayCount.push(data);
            }
            
        });

        setArrivalCount(arrivalCount.length);
        setDepartureCount(departureCount.length);
        setHolidayCount(holidayCount.length)
        console.log('arrivalCount',arrivalCount, arrivalCount.length)
        console.log('calendarData',calendarData, ...calendarData);

    }
    ,[calendarData]);

    //get first and last day of the month

    const getFirstAndLastDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDate = new Date(year, month, 1);
        const lastDate = new Date(year, month + 1, 0);
        const getMonth = monthNames.at(month)

        setMonthFirstDay(firstDate.getTime());
        setMonthLastDay(lastDate.getTime());
        setCurrentmonth(getMonth)

        console.log('getFirstAndLastDate ', firstDate.getTime(), lastDate.getTime(), getMonth)
        
    }


    return(
        <ThemeProvider theme={ThemeCustom}>
            <WarningModal warningModalOpen={warningModalOpen}/>
            <Container maxWidth='xl' className="mt-20 relative">
                <div className="flex border border-solid border-jet mb-7 rounded-lg md:flex-row flex-col">

                    <div className={`md:w-2/3 w-full text-white md:flex justify-center items-center home-container ${!show && isMobile ? 'onShow' : ''} ${isMobile ? 'onHide' : ''} relative`}>
                        <SimpleBar className={`h-full py-11 sm:px-8 px-4 w-full ${!buttonDisable ? 'pointer-events-none opacity-40':''}`}>
                            <CalendarComp 
                                calendarData={calendarData} 
                                setSelDate={setSelDate} 
                                buttonDisable={buttonDisable}
                                setHoliday={setHoliday}
                                setShow={setShow}
                                getFirstAndLastDate={getFirstAndLastDate}
                            />
                        </SimpleBar>    
                        <div className="text-white absolute bottom-0 py-2 w-full bg-primary rounded-b-lg">
                            <div className="flex justify-center items-center ">
                                    <div className="flex items-center mr-5">
                                        <div className="bg-green w-3 p-2 rounded mr-3"></div>
                                        <div className="text-sm font-medium">Arrival</div>
                                    </div>
                                    <div className="flex items-center mr-5">
                                        <div className="bg-tan w-3 p-2 rounded mr-3"></div>
                                        <div className="text-sm font-medium">Departure</div>
                                    </div>
                                    <div className="flex items-center mr-5">
                                        <div className="bg-secondary w-3 p-2 rounded mr-3"></div>
                                        <div className="text-sm font-medium">A & D</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-red w-3 p-2 rounded mr-3"></div>
                                        <div className="text-sm font-medium">Holiday</div>
                                    </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`md:w-1/3 text-white border-l border-0 border-solid border-jet w-full home-container ${show && isMobile ? 'onShow' : ''} ${isMobile ? 'onHide' : ''}`}>
                        <SimpleBar className="h-full p-4 pb-11 px-8 w-full">
                                {/* <Typography variant="text32" className="mt-5" component={'div'}>Hello, {props.user.split(" ")[0]}</Typography> */}
                                <Typography variant="text32" className="mt-5" component={'div'}>Hello, {props.user.split(" ") ?  props.user.split(" ")[0] : props.user}</Typography>
                            <Typography variant="textAltBase" className="mt-2" component={'div'}>Keep your transport details up to date!</Typography>
                            <div className="py-5 border-b border-0 border-solid border-jet">   
                                <Typography variant="textAlt80" className="mb-5 font-semibold flex md:justify-center items-baseline text-white" component={'div'}>{selDate.getDate()} <span className="text-xl font-normal text-taupe-gray ms-3">{selDate.toLocaleString('default', { month: 'long' })}</span></Typography>
                                <UtilizeEdit 
                                    calendarData={calendarData} 
                                    selDate={selDate} 
                                    buttonDisable={buttonDisable} 
                                    setButtonDisable={setButtonDisable}
                                    //calendarDataArray={calendarDataArray}
                                    setHoliday={setHoliday}
                                    holiday={holiday}
                                    setShow={setShow}
                                    setStatus={setStatus}
                                    postFormData={postFormData}
                                />
                            </div>
                            <div>
                                <Typography variant="textAltBase" className="mt-5" component={'div'}>Here's a quick summary of your {currentmonth} Utilization</Typography>
                                <div className="flex justify-between items-center mt-5">
                                    <Typography variant="textBase" className="" component={'div'}>Arrival</Typography>
                                    <Typography variant="textBase" className="font-semibold" component={'div'}>{Object.keys(userSummary).length > 0 ? userSummary.arrivalCount : 0}</Typography>
                                </div>
                                <div className="flex justify-between items-center mt-5">
                                    <Typography variant="textBase" className="" component={'div'}>Departure</Typography>
                                    <Typography variant="textBase" className="font-semibold" component={'div'}>{Object.keys(userSummary).length > 0 ? userSummary.departureCount : 0}</Typography>
                                </div>
                                <div className="flex justify-between items-center mt-5">
                                    <Typography variant="textBase" className="" component={'div'}>Number of Days</Typography>
                                    <Typography variant="textBase" className="font-semibold" component={'div'}>{Object.keys(userSummary).length > 0 ? userSummary.numOfDays : 0}</Typography>
                                </div>
                            </div>
                            </SimpleBar>
                    </div>
                    
                </div>
                <Stack spacing={2} className="md:max-w-[25vw] max-w-[70vw] w-full absolute bottom-1 right-10">
                    <AlertSuccess successAlertOpen={successAlertOpen} setSuccessAlertOpen={setSuccessAlertOpen} successText={successText}/>
                    <AlertError errorAlertOpen={errorAlertOpen} setErrorAlertOpen={setErrorAlertOpen} errorText={errorText}/>
                </Stack>
            </Container>
        </ThemeProvider>
    );
}

export default Home;