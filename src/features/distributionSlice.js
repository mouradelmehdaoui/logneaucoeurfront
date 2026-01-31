import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/distribution";

// helper pour token
const authHeader = (getState) => {
  const token = getState().auth.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// GET distributions par secteur
export const fetchDistributions = createAsyncThunk(
  "distribution/fetch",
  async (page = 1, { getState }) => {
    const res = await axios.get(
      `http://localhost:5000/api/distribution?page=${page}`, // plus de secteur ici
      authHeader(getState)
    );
    return res.data;
  }
);


// CREATE distribution
export const createDistribution = createAsyncThunk(
  "distribution/create",
  async (payload, { getState }) => {
    const res = await axios.post(
      "http://localhost:5000/api/distribution",
      payload,
      authHeader(getState)
    );
    return res.data;
  }
);


// UPDATE distribution
export const updateDistribution = createAsyncThunk(
  "distribution/update",
  async ({ id, data }, { getState }) => {
    const res = await axios.put(`${API_URL}/${id}`, data, authHeader(getState));
    return res.data;
  }
);

// DELETE distribution
export const deleteDistribution = createAsyncThunk(
  "distribution/delete",
  async (id, { getState }) => {
    await axios.delete(`${API_URL}/${id}`, authHeader(getState));
    return id;
  }
);

const distributionSlice = createSlice({
  name: "distribution",
  initialState: { list: [], totalPages: 1, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistributions.pending, (state) => { state.loading = true; })
      .addCase(fetchDistributions.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(createDistribution.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateDistribution.fulfilled, (state, action) => {
        state.list = state.list.map(d => d._id === action.payload._id ? action.payload : d);
      })
      .addCase(deleteDistribution.fulfilled, (state, action) => {
        state.list = state.list.filter(d => d._id !== action.payload);
      });
  }
});

export default distributionSlice.reducer;
