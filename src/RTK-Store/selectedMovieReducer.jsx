import { createSlice } from '@reduxjs/toolkit';
const key = import.meta.env.VITE_TMDB_API_KEY;

const promiseA = fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US`)
.then(res=>res.json())
.then(data=>{return data.results[0].id});

const selectedMovieSlice = createSlice({
  name: 'selectedMovie',
  initialState: {
    //data: await promiseA,
	data: null,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = selectedMovieSlice.actions;
export const selectData = (state) => state.selectedMovie.data;
export default selectedMovieSlice.reducer;