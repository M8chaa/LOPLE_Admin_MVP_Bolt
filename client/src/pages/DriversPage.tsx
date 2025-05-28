import React, { useEffect, useState } from 'react';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Driver {
  id: number;
  name: string;
  status: string;
  phone?: string;
}

export default function DriversPage() {
  const { token } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await axios.get('http://localhost:4000/api/drivers', { headers });
      setDrivers(res.data);
    };
    fetchDrivers();
  }, [token]);

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Drivers
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Phone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>{driver.name}</TableCell>
              <TableCell>{driver.status}</TableCell>
              <TableCell>{driver.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}