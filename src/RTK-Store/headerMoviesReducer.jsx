import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHeaderMovies = createAsyncThunk('headerMoviesSlice/fetchHeaderMovies', async()=>{
    const key = import.meta.env.VITE_TMDB_API_KEY;
    const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1&region=us&sort_by=vote_count.desc`);
    const data = await res.json();
    return data.results;
})

const headerMoviesSlice = createSlice({
    initialState: [],
    name: 'headerMoviesSlice',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchHeaderMovies.fulfilled, (state,action)=>{
            return action.payload;
        })
    }
  })

export default headerMoviesSlice.reducer;