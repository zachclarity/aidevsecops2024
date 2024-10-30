// React
import { Autocomplete, Box, Button, Card, CardActions, CardContent, Grid, Stack, TextField } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React from 'react'

import useStorage from '../api/useStorage'

const blankEntry = {
    datetime: new Date(),
    dodid: '',
    lastName: '',
    firstName: '',
    gender: null,
    statusLevel: null,
    bloodType: '',
    dob: null,
    allergies: [],
    vitals: [],
    location: "Triage"
}

const triageStates = [
    "U",
    "I",
    "D",
    "E"
]

function EntryCard(props) {

    const { 
        addEntry, 
        incomingData
     } = props

    const [data, setData] = React.useState(incomingData === undefined ? blankEntry : incomingData)

    function submit() {
        if (incomingData === undefined) {
            data.datetime = new Date()
        }
        addEntry({
            ...data,
        })
        setData(blankEntry)
    }

    React.useEffect(() => {
        if (incomingData !== undefined) {
            setData(incomingData)
        }
    }, [incomingData])


    const isValid = data.dodid.length && data.lastName.length

    return (
        <Card>
            <CardContent>
                <Stack spacing={1} direction="row">
                    <TextField
                        fullWidth
                        required
                        label="BR #"
                        value={data.dodid}
                        onChange={event => setData({ ...data, dodid: event.target.value })}
                    />
                    <TextField
                        fullWidth
                        required
                        label="Last Name"
                        value={data.lastName}
                        onChange={event => setData({ ...data, lastName: event.target.value })}
                    />
                    <Autocomplete
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Sex" />}
                        options={[
                            "Male",
                            "Female"
                        ]}
                        value={data.gender}
                        onChange={(_, newValue) => setData({...data, gender: newValue})}
                    />
                    <Autocomplete
                        renderInput={(params) => <TextField {...params} label="Status" />}
                        options={triageStates}
                        value={triageStates[data.statusLevel]}
                        onChange={(_, newValue) => setData({...data, statusLevel: triageStates.indexOf(newValue)})}
                    />
                    <TextField
                        fullWidth
                        label="Location"
                        value={data.location}
                        onChange={event => setData({ ...data, location: event.target.value })}
                    />
                </Stack>
            </CardContent>
            <CardActions>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant='contained'
                    onClick={submit}
                    disabled={!isValid}
                >
                    Submit
                </Button>
            </CardActions>
        </Card>
    )
}

function TriageTable(props) {

    const {selected, setSelected} = props

    const [patients] = useStorage("patients", {})
    const rows = Object.keys(patients).map((key, index) => {
        return {
            ...patients[key],
            id: key,
            index: index + 1,
            statusLevel: triageStates[patients[key].statusLevel]
        }
    })

    const columns = [
        {
            field: "index",
            headerName: "#",
            flex: .5
        },
        {
            field: "datetime",
            headerName: "Time",
            flex: 1.5
        },
        {
            field: "dodid",
            headerName: "BR #",
            flex: .5
        },
        {
            field: "lastName",
            headerName: "Name",
            flex: 1
        },
        {
            field: "gender",
            headerName: "Sex",
            flex: .75
        },
        {
            field: "statusLevel",
            headerName: "Triage",
            flex: .5
        },
        {
            field: "location",
            headerName: "Location",
            flex: 1
        },
    ]

    return (
        <Box sx={{ width: "100%", height: "calc(100vh - 230px)" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                rowSelectionModel={selected}
                onRowSelectionModelChange={selection => setSelected(selection)}
            />
        </Box>
    )
}

function TriagePage(props) {

    const [patients, setPatients] = useStorage("patients", {})
    const [selected, setSelected] = React.useState([])

    function addEntry(data) {
        setPatients({
            ...patients,
            [data.dodid]: data
        })
        setSelected([])
    }

    return (
        <>
            <Grid item xs={12}>
                <EntryCard
                    addEntry={addEntry}
                    incomingData={selected.length ? patients[selected] : undefined}
                />
            </Grid>
            <Grid item xs={12}>
                <TriageTable
                    selected={selected}
                    setSelected={setSelected}
                />
            </Grid>
        </>
    )

}

export default TriagePage