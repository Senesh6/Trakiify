import { createTheme } from '@mui/material/styles';

export const ThemeMain = createTheme({
    palette: {
      primary: {
        main: '#1D1E22',
        light: '#4f8ff8',
        dark: '#1851ac',
      },
      secondary: {
        main: '#2374F7',
      },
      taupeGray: {
        main: '#81818D',
      },
      jet: {
        main: '#2B2B2B',
        light: '#555555',
        dark: '#1e1e1e',
      },
      indianRed: {
        main: '#E95054',
      },
      munsell: {
        main: '#518791',
      },
      gamboge: {
        main: '#F09917',
      },
      white: {
        main: '#FFF',
      },
      gray: {
        main: '#757575',
      },
    },
    typography: {
        fontFamily: ['popins', 'sans-serif'].join(','),
        fontSize: 16
    },
});      

export const ThemeCustom = createTheme({

  typography:{
      logo:{
        color: ThemeMain.palette.white.main,
        fontSize:'2.5rem',
        fontWeight:'600'
      },
      logoNav:{
        color: ThemeMain.palette.white.main,
        fontSize:'2rem',
        fontWeight:'600'
      },
      textAltBase:{
        color: ThemeMain.palette.taupeGray.main,
        fontSize:'1rem',
        fontWeight:'500'
      },
      textAlt20:{
        color: ThemeMain.palette.taupeGray.main,
        fontSize:'1rem',
        fontWeight:'500'
      },
      text24:{
        color: ThemeMain.palette.white.main,
        fontSize:'1.5rem',
        fontWeight:'500'
      },
      text20:{
        color: ThemeMain.palette.white.main,
        fontSize:'1.25rem',
        fontWeight:'500'
      },
      textBase:{
        fontSize:'1rem',
        fontWeight:'500'
      },
      text32:{
        color: ThemeMain.palette.white.main,
        fontSize:'2rem',
        fontWeight:'500'
      },
      textAlt80:{
        color: ThemeMain.palette.taupeGray.main,
        fontSize:'5rem',
        fontWeight:'500'
      },
  },
  components:{
    MuiInputLabel:{
      styleOverrides:{
        root:{
          position:'relative',
          fontSize:'1rem',
          color: ThemeMain.palette.white.main,
          fontFamily: ['popins', 'sans-serif'].join(','),
          fontWeight: 500,
          transform:'inherit',
          marginBottom:'0.5rem',
          '&.Mui-focused':{
            color: ThemeMain.palette.white.main
          }
        }
      }
    },
    MuiOutlinedInput:{
      styleOverrides:{
        root:{
          borderRadius:'0.5rem',
          width:'100%',
          backgroundColor: ThemeMain.palette.jet.main,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline':{
            borderColor:  ThemeMain.palette.taupeGray.main,
            borderWidth: '1px'
          },
          '& .MuiOutlinedInput-notchedOutline':{
            borderWidth: '0'
          },
        },
        input:{
          fontSize: '1rem',
          color: ThemeMain.palette.white.main,
          fontFamily: ['popins', 'sans-serif'].join(','),
          fontWeight: 500,
          padding: '0.75rem 1rem'
        }
      }
    },
    MuiFormControl:{
      styleOverrides:{
        root:{
          marginBottom:'1.5rem'
        }
      }  
    },
    MuiMenuItem:{
      styleOverrides:{
        root:{
          backgroundColor:ThemeMain.palette.jet.main,
          '&.Mui-selected':{
            backgroundColor:ThemeMain.palette.taupeGray.main,
          },
          '&:hover':{
            backgroundColor:ThemeMain.palette.taupeGray.main,
          }
        }
      } 
    },
    MuiPaper:{
      styleOverrides:{
        root:{
          backgroundColor:'transparent',
          margin:'0px !important'
        }
      }
    },
    MuiList:{
      styleOverrides:{
        root:{
          backgroundColor:ThemeMain.palette.jet.main,
          borderRadius: '0.5rem',
          marginTop:'0.75rem'
        }
      }
    },
    MuiButton:{
      variants:[
        {
          props:{variant:'secondary'},
          style:{
            color: ThemeMain.palette.white.main,
            backgroundColor: ThemeMain.palette.secondary.main,
            minWidth:'7.5rem',
            padding: '0.6rem 1rem',
            '&:hover':{
              backgroundColor:ThemeMain.palette.secondary.dark,
            }
          }
        },
        {
          props:{variant:'jet'},
          style:{
            color: ThemeMain.palette.white.main,
            backgroundColor: ThemeMain.palette.jet.main,
            minWidth:'7.5rem',
            padding: '0.6rem 1rem',
            '&:hover':{
              backgroundColor:ThemeMain.palette.jet.light,
            },
            '&.Mui-disabled':{
              color:ThemeMain.palette.gray.main
            }
          }
        }
      ],
      styleOverrides:{
        root:{
            fontSize: '1rem',
            fontFamily: ['popins', 'sans-serif'].join(','),
            fontWeight: 500,
            borderRadius: '0.5rem'
        }
      }
    },
    MuiButtonBase:{
      styleOverrides:{
        root:{
            fontFamily: `${['popins', 'sans-serif'].join(',')} !important` ,
        }
      }
    },
    MuiDateCalendar:{
      styleOverrides:{
        root:{
            fontFamily: `${['popins', 'sans-serif'].join(',')} !important` ,
        }
      }
    },
    MuiDialogContentText:{
      styleOverrides:{
        root:{
          fontSize: '1rem',
          color: ThemeMain.palette.taupeGray.main,
          fontWeight: 500,
          paddingBottom:'1.5rem',
          paddingTop:'1.5rem',
        }
      }
    },
    MuiDialogTitle:{
      styleOverrides:{
        root:{
          padding:'1.5rem',
          borderBottom:`1px solid ${ThemeMain.palette.jet.main}`
        }
      }
    },
    MuiDialogContent:{
      styleOverrides:{
        root:{
          padding:'0 1.5rem',
        }
      }
    },
    MuiDialogActions:{
      styleOverrides:{
        root:{
          padding:'1.5rem',
          borderTop:`1px solid ${ThemeMain.palette.jet.main}`
        }
      }
    },
    MuiSwitch:{
      styleOverrides:{
        switchBase:{
          '&.Mui-checked': {
            '& + .MuiSwitch-track': {
              backgroundColor: ThemeMain.palette.secondary.main,
              opacity: 1,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              backgroundColor: ThemeMain.palette.jet.main,
              opacity: 0.5,
            }
          }
        },
        track:{
          backgroundColor: ThemeMain.palette.jet.main,
          opacity:1
        }
      }
    },
    MuiAppBar:{
      styleOverrides:{
        root:{
          backgroundColor: ThemeMain.palette.primary.main,
          boxShadow: `0px 1px 1px 0px ${ThemeMain.palette.jet.main}`
        }
      }
    },
    MuiToolbar:{
      styleOverrides:{
        root:{
          justifyContent:'space-between'
        }
      }
    }
  }
    
});

export const MaterialTableTheme = createTheme({
  components:{
    MuiPaper:{
      styleOverrides:{
        root:{
          backgroundColor: `${ThemeMain.palette.primary.main} !important`,
          boxShadow:'none'
        }
      }
    },
    MuiToolbar:{
      styleOverrides:{
        root:{
          backgroundColor: `${ThemeMain.palette.primary.main} !important`,
          color:ThemeMain.palette.white.main,
          textAlign:'right'
        }
      }
    },
    MuiTableRow:{
      styleOverrides:{
        root:{
          backgroundColor: `${ThemeMain.palette.primary.main} !important`,
        }
      }
    },
    MuiTableCell:{
      styleOverrides:{
        root:{
          color:ThemeMain.palette.white.main,
          fontSize:'1rem'
        }
      }
    },
    MuiToolbar:{
      styleOverrides:{
        root:{
          backgroundColor: ThemeMain.palette.primary.main
        }
      }
    },
    MuiTableBody:{
      styleOverrides:{
        root:{
          backgroundColor:ThemeMain.palette.primary.main
        }
      }
    },
    MuiInputBase:{
      styleOverrides:{
        root:{
          borderRadius:'0',
          '&.MuiInput-root:before':{
            borderColor: ThemeMain.palette.jet.main,
          },
          '&.MuiInput-root:after':{
            borderColor: ThemeMain.palette.taupeGray.main,
          },
          '&.MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before':{
            borderColor: ThemeMain.palette.jet.main,
            borderWidth: '2px'
          },
          '&.Mui-focused:after':{
            borderColor:  ThemeMain.palette.taupeGray.main,
          }
        },
        input:{
          fontSize: '1rem',
          color: ThemeMain.palette.white.main,
          fontFamily: ['popins', 'sans-serif'].join(','),
          fontWeight: 500,
          padding: '0.75rem 1rem'
        }
      }
    },
    MuiToolbar:{
      styleOverrides:{
        root:{
          fontSize:'1rem',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':{
            fontSize:'1rem'
          }
        }
      }
    }
  }  
})

