import React, {useEffect, useState} from "react";

import {ThemeProvider, Typography, Container, Stack } from '@mui/material';
import SimpleBar from 'simplebar-react';


import {ThemeMain, ThemeCustom} from '../style/Theme'
import 'simplebar-react/dist/simplebar.min.css';

import ReportTable from "../components/table/Table";
import WarningModal from "../components/modal/Modal_warning";
import AlertSuccess from "../components/alert/Alert_success";
import AlertError from "../components/alert/Alert_error";


const Admin = (props) =>{

    const [token, setToken] = useState('')
    const [warningModalOpen, setWarningModalOpen] = useState(false)
    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [successText, setSuccessText] = useState('Success!')
    const [errorText, setErrorText] = useState('Oops! Something went wrong. Please try again.')

    useEffect(()=>{

        console.log('admin', props.token)
        if(props.token !== ''){
            setWarningModalOpen(false)
        }
        else{
            setWarningModalOpen(true)
        }
        setToken(props.token)
        
    },[props.token])

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

    return(

        <ThemeProvider theme={ThemeCustom}>
            <WarningModal warningModalOpen={warningModalOpen}/>
            <Container maxWidth='xl' className="admin-report relative">
                <div className="sm:mt-[64px] mt-[56px]">
                    <div className="pt-7 flex justify-between flex-col">
                        <Typography variant="text24" className="mb-5" component={'div'} >Utilization Report</Typography>
                        <div className="flex items-center w-full muiTable border border-solid border-jet px-8 py-4 mb-7 md:mb-0 rounded-lg uti-table">
                            <SimpleBar className={`h-full max-h-[calc(100vh-13.25rem)] min-h-[calc(100vh-13.25rem)] w-full`}>
                                <ReportTable 
                                    token={props.token}
                                    setSuccessAlertOpen={setSuccessAlertOpen} 
                                    setSuccessText={setSuccessText}
                                    setErrorAlertOpen={setErrorAlertOpen} 
                                    setErrorText={setErrorText}
                                />
                            </SimpleBar>
                        </div>
                    </div>    
                </div>
                <Stack spacing={2} className="md:max-w-[25vw] max-w-[70vw] w-full absolute bottom-1 right-10">
                    <AlertSuccess 
                        successAlertOpen={successAlertOpen} 
                        setSuccessAlertOpen={setSuccessAlertOpen} 
                        successText={successText}
                    />
                    <AlertError 
                        errorAlertOpen={errorAlertOpen} 
                        setErrorAlertOpen={setErrorAlertOpen} 
                        errorText={errorText}
                    />
                </Stack>
            </Container>
        </ThemeProvider>
        
    );
}

export default Admin;