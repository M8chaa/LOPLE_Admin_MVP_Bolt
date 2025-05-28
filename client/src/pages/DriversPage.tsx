import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Fab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  LocalShipping as TruckIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Driver {
  id: number;
  name: string;
  status: string;
  phone?: string;
  vehicleInfo?: string;
}

interface DriverFormData {
  name: string;
  phone: string;
  vehicleInfo: string;
}

export default function DriversPage() {
  const { token } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<DriverFormData>({
    name: '',
    phone: '',
    vehicleInfo: '',
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string>('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/drivers', { headers });
      setDrivers(res.data);
      setError('');
    } catch (err) {
      setError('운전기사 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [token]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return '대기중';
      case 'on_delivery': return '운송중';
      case 'offline': return '오프라인';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'on_delivery': return 'warning';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const filteredDrivers = statusFilter === 'all' 
    ? drivers 
    : drivers.filter(driver => driver.status === statusFilter);

  const handleCreateDriver = async () => {
    if (!formData.name || !formData.phone) {
      setError('이름과 전화번호는 필수 입력 사항입니다.');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/drivers', formData, { headers });
      setOpenDialog(false);
      setFormData({ name: '', phone: '', vehicleInfo: '' });
      setError('');
      fetchDrivers();
    } catch (err) {
      setError('운전기사 생성에 실패했습니다.');
    }
  };

  const handleUpdateDriver = async () => {
    if (!editingDriver || !formData.name || !formData.phone) {
      setError('이름과 전화번호는 필수 입력 사항입니다.');
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/drivers/${editingDriver.id}`, formData, { headers });
      setOpenDialog(false);
      setEditingDriver(null);
      setFormData({ name: '', phone: '', vehicleInfo: '' });
      setError('');
      fetchDrivers();
    } catch (err) {
      setError('운전기사 정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteDriver = async (driverId: number) => {
    if (!confirm('정말로 이 운전기사를 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/drivers/${driverId}`, { headers });
      fetchDrivers();
    } catch (err) {
      setError('운전기사 삭제에 실패했습니다.');
    }
  };

  const handleStatusChange = async (driverId: number, newStatus: string) => {
    try {
      await axios.put(`http://localhost:4000/api/drivers/${driverId}`, { status: newStatus }, { headers });
      fetchDrivers();
    } catch (err) {
      setError('상태 변경에 실패했습니다.');
    }
  };

  const openCreateDialog = () => {
    setEditingDriver(null);
    setFormData({ name: '', phone: '', vehicleInfo: '' });
    setOpenDialog(true);
  };

  const openEditDialog = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone || '',
      vehicleInfo: driver.vehicleInfo || '',
    });
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>운전기사 데이터 로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            운전기사 관리
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            운전기사 현황 및 정보 관리
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="새로고침">
            <IconButton onClick={fetchDrivers}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters and Stats */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>상태 필터</InputLabel>
          <Select
            value={statusFilter}
            label="상태 필터"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="available">대기중</MenuItem>
            <MenuItem value="on_delivery">운송중</MenuItem>
            <MenuItem value="offline">오프라인</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          총 {filteredDrivers.length}명의 운전기사
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Chip 
            label={`대기중: ${drivers.filter(d => d.status === 'available').length}명`}
            color="success"
            size="small"
          />
          <Chip 
            label={`운송중: ${drivers.filter(d => d.status === 'on_delivery').length}명`}
            color="warning"
            size="small"
          />
          <Chip 
            label={`오프라인: ${drivers.filter(d => d.status === 'offline').length}명`}
            color="default"
            size="small"
          />
        </Box>
      </Box>

      {/* Drivers Grid */}
      <Grid container spacing={2}>
        {filteredDrivers.map((driver) => (
          <Grid item xs={12} sm={6} md={4} key={driver.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                      {driver.name}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(driver.status)} 
                      color={getStatusColor(driver.status) as any}
                      size="small"
                    />
                  </Box>
                </Box>

                <List dense>
                  {driver.phone && (
                    <>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <PhoneIcon color="action" />
                        </ListItemAvatar>
                        <ListItemText 
                          primary="전화번호"
                          secondary={driver.phone}
                        />
                        <IconButton size="small" onClick={() => window.open(`tel:${driver.phone}`)}>
                          <PhoneIcon />
                        </IconButton>
                      </ListItem>
                      <Divider />
                    </>
                  )}
                  {driver.vehicleInfo && (
                    <>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <TruckIcon color="action" />
                        </ListItemAvatar>
                        <ListItemText 
                          primary="차량정보"
                          secondary={driver.vehicleInfo}
                        />
                      </ListItem>
                      <Divider />
                    </>
                  )}
                </List>

                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>상태 변경</InputLabel>
                    <Select
                      value={driver.status}
                      label="상태 변경"
                      onChange={(e) => handleStatusChange(driver.id, e.target.value)}
                    >
                      <MenuItem value="available">대기중</MenuItem>
                      <MenuItem value="on_delivery">운송중</MenuItem>
                      <MenuItem value="offline">오프라인</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => openEditDialog(driver)}
                      sx={{ flex: 1 }}
                    >
                      수정
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteDriver(driver.id)}
                    >
                      삭제
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredDrivers.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <PersonAddIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            등록된 운전기사가 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            새로운 운전기사를 등록해보세요.
          </Typography>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={openCreateDialog}
      >
        <AddIcon />
      </Fab>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDriver ? '운전기사 정보 수정' : '새 운전기사 등록'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="이름"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            label="전화번호"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            sx={{ mb: 2 }}
            required
            placeholder="010-1234-5678"
          />
          <TextField
            margin="dense"
            label="차량정보"
            fullWidth
            variant="outlined"
            value={formData.vehicleInfo}
            onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
            placeholder="예: 현대 포터 25라1234"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button onClick={editingDriver ? handleUpdateDriver : handleCreateDriver} variant="contained">
            {editingDriver ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}