import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const [summary, setSummary] = useState({ callcards: 0, drivers: 0 });
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const [callRes, driverRes] = await Promise.all([
        axios.get('http://localhost:4000/api/callcards', { headers }),
        axios.get('http://localhost:4000/api/drivers', { headers }),
      ]);
      setSummary({ callcards: callRes.data.length, drivers: driverRes.data.length });
    };
    fetchData();
  }, [token]);

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Callcards</Typography>
            <Typography variant="h3">{summary.callcards}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Drivers</Typography>
            <Typography variant="h3">{summary.drivers}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}