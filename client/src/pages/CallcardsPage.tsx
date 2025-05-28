import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Driver {
  id: number;
  name: string;
}
interface Callcard {
  id: number;
  title: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  driverId?: number;
  Driver?: Driver;
}

export default function CallcardsPage() {
  const { token } = useAuth();
  const [callcards, setCallcards] = useState<Callcard[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    const [cardRes, driverRes] = await Promise.all([
      axios.get('http://localhost:4000/api/callcards', { headers }),
      axios.get('http://localhost:4000/api/drivers', { headers }),
    ]);
    setCallcards(cardRes.data);
    setDrivers(driverRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAssign = async (cardId: number, driverId: number | null) => {
    if (driverId) {
      await axios.post(
        `http://localhost:4000/api/callcards/${cardId}/assign`,
        { driverId },
        { headers }
      );
    } else {
      await axios.post(
        `http://localhost:4000/api/callcards/${cardId}/unassign`,
        {},
        { headers }
      );
    }
    fetchData();
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Callcards
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Pickup</TableCell>
            <TableCell>Dropoff</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {callcards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>{card.title}</TableCell>
              <TableCell>{card.pickupLocation}</TableCell>
              <TableCell>{card.dropoffLocation}</TableCell>
              <TableCell>{card.status}</TableCell>
              <TableCell>{card.Driver ? card.Driver.name : '-'}</TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={card.driverId || ''}
                  displayEmpty
                  onChange={(e) =>
                    handleAssign(card.id, e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem value={driver.id} key={driver.id}>
                      {driver.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}