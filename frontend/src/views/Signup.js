import React, {useEffect, useState} from "react";
import {ThemeProvider, Container, Stack} from '@mui/material';

import {ThemeMain, ThemeCustom} from '../style/Theme'

import SignUpForm from "../components/sign-forms/Signup-form";
import AlertSuccess from "../components/alert/Alert_success";
import AlertError from "../components/alert/Alert_error";

const SignUp = () => {

    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [successText, setSuccessText] = useState('Success!')
    const [errorText, setErrorText] = useState('Oops!')

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
            <Container maxWidth='xl' className="relative">
                <SignUpForm
                    setSuccessAlertOpen={setSuccessAlertOpen} 
                    setSuccessText={setSuccessText}
                    setErrorAlertOpen={setErrorAlertOpen} 
                    setErrorText={setErrorText}
                />
                <Stack spacing={2} className="md:max-w-[25vw] max-w-[70vw] w-full absolute bottom-16 right-10">
                    <AlertSuccess successAlertOpen={successAlertOpen} setSuccessAlertOpen={setSuccessAlertOpen} successText={successText}/>
                    <AlertError errorAlertOpen={errorAlertOpen} setErrorAlertOpen={setErrorAlertOpen} errorText={errorText}/>
                </Stack>
            </Container>
        </ThemeProvider>
    );
}

export default SignUp;