// React
import React from 'react'
// mui
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { NewOrdersSection } from '../../content/ae/tabs/OrdersTab'


function NotesForm(props) {
    const {
        open,
        close,
        addNote
    } = props

    function submit(data) {
        addNote(data)
        close()
    }

    return (
        <Dialog
            open={open}
            onClose={close}
            maxWidth="lg"
            fullWidth
            scroll="body"
        >
            <DialogTitle align="center">
                Add A Note
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1} sx={{marginTop: 1}}>
                    <NewOrdersSection
                        addOrder={submit}
                    />
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default NotesForm