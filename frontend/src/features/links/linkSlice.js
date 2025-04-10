import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://sdeintern-vxir.vercel.app/api';

export const fetchLinks = createAsyncThunk(
  'links/fetchLinks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.get(`${API_URL}/links`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createLink = createAsyncThunk(
  'links/createLink',
  async (linkData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.post(`${API_URL}/links`, linkData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const linkSlice = createSlice({
  name: 'links',
  initialState: {
    links: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload;
        state.error = null;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.links.push(action.payload);
      });
  },
});

export default linkSlice.reducer;