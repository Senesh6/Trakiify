import React, {useState, useEffect} from 'react';
import axios from 'axios';

import { MaterialReactTable } from 'material-react-table';
import { Box, Button, ThemeProvider } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { useMediaQuery } from 'react-responsive'

import {MaterialTableTheme} from '../../style/Theme';
import './table.scss'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';



const columns = [
    {
      accessorKey: 'fullName',
      header: 'Full Name',
      size: 240,
    },
    {
      accessorKey: 'route',
      header: 'Route',
    },
    {
      accessorKey: 'userArrivalCount',
      header: 'Arrival',
    },
    {
      accessorKey: 'userDepartureCount',
      header: 'Departure',
    },
    {
      accessorKey: 'numOfDays',
      header: 'Utilized Days',
    },
    {
      accessorKey: 'userUtilizationEfficiency',
      header: 'Efficiency',
    },
  ];

  const data = [
    {
      id: 1,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 2,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 3,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 4,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 5,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 6,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 7,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 8,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 9,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 10,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 11,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
    {
      id: 12,
      fullName: 'Elenora Wilkinson',
      route: 'Galle',
      workingDays: 21,
      arrival: 5,
      departure: 10,
      days:8,
      efficiency: '40%'
    },
  ] 
  
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };
  
  // const BaseUrl = 'http://localhost:3500/api';
  const BaseUrl = 'https://trakiify-be.onrender.com/api';


const ReportTable = (props) => {

    const [value, onChange] = useState([new Date(), new Date()]);
    const isMobile = useMediaQuery({ query: '(max-width: 900px)' })
    const [tableRow, setTableRow] = useState([])
    const [token, setToken] = useState('')


    useEffect(()=>{

      console.log('table', props.token)
      setToken(props.token)
      
  },[props.token])

    useEffect(()=>{

      getTableData()
      
    },[token])

    const getTableData = () => {

      let monthFirstDay = value.at(0).setHours(0, 0, 0, 0)
      let monthLastDay = value.at(1).setHours(0, 0, 0, 0)

      console.log('monthFirstDay', monthFirstDay)

      let data = JSON.stringify({
        "fromDate": monthFirstDay,
        "toDate": monthLastDay
      });

      axios.post(`${BaseUrl}/travel/getReportData`,data,{
          headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            }
      })
      .then((response) => {
          console.log('axios',response.data);
          //setCalendarData(response.data)
          setTableRow(response.data.userData)
        })
        .catch((error) => {
          console.log(error, error.response.data.error);
          props.setErrorAlertOpen(true)
          props.setErrorText(error.response.data.error)
      });

    }

    useEffect(()=>{
      console.log('range', value)
      if (value !== null){
        getTableData();
      }
      else{
        onChange([new Date(), new Date()])
      }
    },[value])

    const csvExporter = new ExportToCsv(csvOptions);

    const handleExportRows = (rows) => {
      csvExporter.generateCsv(rows.map((row) => row.original));
    };
    
    const handleExportData = () => {
      csvExporter.generateCsv(tableRow);
    };
    
    return (
      <ThemeProvider theme={MaterialTableTheme}>
        <MaterialReactTable
          style={'bg-primary metStyle'}
          columns={columns}
          data={tableRow}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableColumnFilters={false}
          enableHiding={isMobile?false:true}
          enableGlobalFilter={isMobile?false:true}
          enableRowstatus={isMobile?false:true}
          enableRowSelection={isMobile?false:true}
          enablePagination={false}
          positionToolbarAlertBanner="bottom"
          enableBottomToolbar={false}
          localization={{
              noRecordsToDisplay: (
                    <div className='font-sans font-medium text-base not-italic'>
                        Nothing to show at the moment.
                    </div>
              )
          }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap', backgroundColor:'#1D1E22' }}
            >
              <Button
                color="primary"
                className={`${isMobile?'hidden':''} TableBtn`}
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={handleExportData}
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export All Data
              </Button>
              <Button
                disabled={
                  !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                }
                //only export selected rows
                onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                startIcon={<FileDownloadIcon />}
                variant="contained"
                className={`${isMobile?'hidden':''}TableBtn`}
              >
                Export Selected Rows
              </Button>
              <div className='dateRange-picker'>
              <DateRangePicker onChange={onChange} value={value} maxDate={new Date()}/>
              </div>
            </Box>
          )}
        />
      </ThemeProvider>
    );
}

export default ReportTable;