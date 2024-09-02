import React, {useState} from 'react';
import {Alert, Collapse, IconButton} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';


const AlertError = ({errorAlertOpen, setErrorAlertOpen, errorText}) => {

    return(
        <Collapse in={errorAlertOpen}>
            <Alert 
                variant="filled" 
                severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setErrorAlertOpen(false);
                        }}
                    >
                    <CloseIcon fontSize="small" />
                    </IconButton>
                }
                className='rounded-lg bg-error'
            >
                {errorText}
            </Alert>
        </Collapse>
    )

    
}

export default AlertError;