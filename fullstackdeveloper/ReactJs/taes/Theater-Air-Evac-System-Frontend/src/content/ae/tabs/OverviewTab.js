// React
import { Autocomplete, Box, Card, CardContent, CardHeader, Grid, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import Graph from '../../../components/Graph'
import MultiGraph from '../../../components/MultiGraph'



function VitalCard(props) {
    const { title, content } = props

    return (
        <Card>
            <CardHeader
                title={title}
            />
            <CardContent>
                <Typography variant="h2" align="center">
                    {content}
                </Typography>
            </CardContent>
        </Card>
    )
}

function VitalsGraphs(props) {

    const { vitals } = props
    const times = vitals.map(entry => entry.datetime)

    const pulses = vitals.map(entry => entry.pulse)
    const maps = vitals.map(entry => entry.map)
    const rrs = vitals.map(entry => entry.rr)
    const spo2s = vitals.map(entry => entry.spo2)
    const co2s = vitals.map(entry => entry.co2)
    const pains = vitals.map(entry => entry.pain)

    const allGraphs = [
        {
            y: pulses,
            x: times,
            name: "Pulse"
        },
        {
            y: rrs,
            x: times,
            name: "Respiratory Rates"
        },
        {
            y: maps,
            x: times,
            name: "MAP"
        },
        {
            y: co2s,
            x: times,
            name: "CO2"
        },
        {
            y: spo2s,
            x: times,
            name: "SPO2"
        },
        {
            y: pains,
            x: times,
            name: "Pain"
        }
    ]

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <MultiGraph
                    data={allGraphs}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Graph
                    title="Pulse"
                    x={times}
                    y={pulses}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Graph
                    title="MAP"
                    x={times}
                    y={maps}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Graph
                    title="RR"
                    x={times}
                    y={rrs}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Graph
                    title="Oxygen"
                    x={times}
                    y={spo2s}
                />
            </Grid>
        </Grid>
    )
}

function OverviewTab(props) {

    const { allergies, diagnosis, updatePatient, notes } = props
    let { vitals } = props
    vitals = vitals || []

    const latestEntry = vitals[vitals.length - 1] || {}
    const vitalsToDisplay = [
        {
            title: "Pulse",
            content: latestEntry.pulse || ""
        },
        {
            title: "Blood Pressure & MAP",
            content: latestEntry.bloodPressure ? `${latestEntry.bloodPressure} (${latestEntry.map})` : ''
        },
        {
            title: "CO2",
            content: latestEntry.co2 || ""
        },
        {
            title: "SPO2",
            content: latestEntry.spo2 || ""
        },
        {
            title: "Pain",
            content: latestEntry.pain || ""
        }
    ]

    return (
        <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
                {vitalsToDisplay.map((vital, index) => <Box key={index} sx={{ flexGrow: 1 }}><VitalCard {...vital} /></Box>)}
            </Stack>
            <TextField
                fullWidth
                label="Primary Diagonsis"
                value={diagnosis}
                onChange={event => updatePatient("diagnosis", event.target.value)}
            />
            <Autocomplete
                multiple
                freeSolo
                fullWidth
                disabled
                renderInput={(params) => <TextField {...params} label="Allergies" />}
                options={[]}
                value={allergies}
            />
            <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={notes}
                onChange={event => updatePatient("notes", event.target.value)}
            />
            <VitalsGraphs
                vitals={vitals}
            />
        </Stack>
    )
}

export default OverviewTab