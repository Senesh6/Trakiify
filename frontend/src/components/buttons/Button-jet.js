import React from "react";
import {ThemeProvider, Button } from '@mui/material';

import {ThemeMain, ThemeCustom} from '../../style/Theme'


const ButtonJet = (props) =>{
    return(
        <ThemeProvider theme={ThemeCustom}>
            <Button variant="jet" type={props.type} onClick={props.onClick} className={props.class} disabled={props.disabled}>
                {props.name}
            </Button>
        </ThemeProvider>
    );
}

export default ButtonJet;