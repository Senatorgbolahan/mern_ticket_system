import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import noteService from './noteService'


const initialState = {
    notes: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

// ***************************************** Get ticket notes
export const getNotes = createAsyncThunk('notes/getAll', async (ticketId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await noteService.getNotes(ticketId, token);
    } catch (error) {
        const message = 
                (error.response && 
                 error.response.data && error.response.data.message) 
                 ||error.message || error.toString()
            
                 return thunkAPI.rejectWithValue(message)
    }
}) 


// ***************************************** Create ticket notes
export const createNotes = createAsyncThunk('notes/create', async ({noteText, ticketId}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await noteService.createNotes(noteText, ticketId, token);
    } catch (error) {
        const message = 
                (error.response && 
                 error.response.data && error.response.data.message) 
                 ||error.message || error.toString()
            
                 return thunkAPI.rejectWithValue(message)
    }
}) 


export const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        reset: (state) => {
            return initialState
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getNotes.pending, (state) => {
            state.isLoading = true
    })
        builder.addCase(getNotes.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.notes = action.payload
    })
        builder.addCase(getNotes.rejected, (state,action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
    })
        builder.addCase(createNotes.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(createNotes.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.notes.push(action.payload)
    })
        builder.addCase(createNotes.rejected, (state,action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
})

    }
})

export const { reset } = noteSlice.actions

export default noteSlice.reducer