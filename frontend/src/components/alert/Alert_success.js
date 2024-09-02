import React, {useState} from 'react';
import {Alert, Collapse, IconButton} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';


const AlertSuccess = ({successAlertOpen, setSuccessAlertOpen, successText}) => {


    return(
        <Collapse in={successAlertOpen}>
            <Alert 
                variant="filled"
                severity="success" 
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setSuccessAlertOpen(false);
                        }}
                    >
                    <CloseIcon fontSize="small" />
                    </IconButton>
                }
                className='rounded-lg bg-success'
            >   
                {successText}
            </Alert>
        </Collapse>
    )

    
}

export default AlertSuccess;