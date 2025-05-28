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
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Driver {
  id: number;
  name: string;
  status: string;
  phone?: string;
}

interface Callcard {
  id: number;
  title: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  driverId?: number;
  Driver?: Driver;
  createdAt: string;
}

interface CallcardFormData {
  title: string;
  pickupLocation: string;
  dropoffLocation: string;
}

export default function CallcardsPage() {
  const { token } = useAuth();
  const [callcards, setCallcards] = useState<Callcard[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<Callcard | null>(null);
  const [formData, setFormData] = useState<CallcardFormData>({
    title: '',
    pickupLocation: '',
    dropoffLocation: '',
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignMenuAnchor, setAssignMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cardRes, driverRes] = await Promise.all([
        axios.get('http://localhost:4000/api/callcards', { headers }),
        axios.get('http://localhost:4000/api/drivers', { headers }),
      ]);
      setCallcards(cardRes.data);
      setDrivers(driverRes.data);
      setError('');
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'in_progress': return '진행중';
      case 'completed': return '완료';
      case 'cancelled': return '취소';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const filteredCallcards = statusFilter === 'all' 
    ? callcards 
    : callcards.filter(card => card.status === statusFilter);

  const handleCreateCard = async () => {
    if (!formData.title || !formData.pickupLocation || !formData.dropoffLocation) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/callcards', formData, { headers });
      setOpenDialog(false);
      setFormData({ title: '', pickupLocation: '', dropoffLocation: '' });
      setError('');
      fetchData();
    } catch (err) {
      setError('콜카드 생성에 실패했습니다.');
    }
  };

  const handleUpdateCard = async () => {
    if (!editingCard || !formData.title || !formData.pickupLocation || !formData.dropoffLocation) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/callcards/${editingCard.id}`, formData, { headers });
      setOpenDialog(false);
      setEditingCard(null);
      setFormData({ title: '', pickupLocation: '', dropoffLocation: '' });
      setError('');
      fetchData();
    } catch (err) {
      setError('콜카드 수정에 실패했습니다.');
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('정말로 이 콜카드를 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/callcards/${cardId}`, { headers });
      fetchData();
    } catch (err) {
      setError('콜카드 삭제에 실패했습니다.');
    }
  };

  const handleAssignDriver = async (cardId: number, driverId: number | null) => {
    try {
      if (driverId) {
        await axios.post(`http://localhost:4000/api/callcards/${cardId}/assign`, { driverId }, { headers });
      } else {
        await axios.post(`http://localhost:4000/api/callcards/${cardId}/unassign`, {}, { headers });
      }
      setAssignMenuAnchor(null);
      setSelectedCardId(null);
      fetchData();
    } catch (err) {
      setError('배차 처리에 실패했습니다.');
    }
  };

  const openCreateDialog = () => {
    setEditingCard(null);
    setFormData({ title: '', pickupLocation: '', dropoffLocation: '' });
    setOpenDialog(true);
  };

  const openEditDialog = (card: Callcard) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      pickupLocation: card.pickupLocation,
      dropoffLocation: card.dropoffLocation,
    });
    setOpenDialog(true);
  };

  const handleAssignMenuOpen = (event: React.MouseEvent<HTMLElement>, cardId: number) => {
    setAssignMenuAnchor(event.currentTarget);
    setSelectedCardId(cardId);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>콜카드 데이터 로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            콜카드 관리
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            배송 요청 생성 및 운전기사 배차 관리
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="새로고침">
            <IconButton onClick={fetchData}>
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

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>상태 필터</InputLabel>
          <Select
            value={statusFilter}
            label="상태 필터"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="pending">대기중</MenuItem>
            <MenuItem value="in_progress">진행중</MenuItem>
            <MenuItem value="completed">완료</MenuItem>
            <MenuItem value="cancelled">취소</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          총 {filteredCallcards.length}개의 콜카드
        </Typography>
      </Box>

      {/* Callcards Grid */}
      <Grid container spacing={2}>
        {filteredCallcards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Chip 
                    label={getStatusLabel(card.status)} 
                    color={getStatusColor(card.status) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      출발: {card.pickupLocation}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'error.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      도착: {card.dropoffLocation}
                    </Typography>
                  </Box>
                </Box>

                {card.Driver && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 1 }} />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {card.Driver.name}
                    </Typography>
                    {card.Driver.phone && (
                      <IconButton size="small" onClick={() => window.open(`tel:${card.Driver!.phone}`)}>
                        <PhoneIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => openEditDialog(card)}
                  >
                    수정
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AssignIcon />}
                    onClick={(e) => handleAssignMenuOpen(e, card.id)}
                    color={card.Driver ? 'success' : 'primary'}
                  >
                    {card.Driver ? '배차변경' : '배차'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    삭제
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={openCreateDialog}
      >
        <AddIcon />
      </Fab>

      {/* Assignment Menu */}
      <Menu
        anchorEl={assignMenuAnchor}
        open={Boolean(assignMenuAnchor)}
        onClose={() => setAssignMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleAssignDriver(selectedCardId!, null)}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="배차 해제" />
        </MenuItem>
        {drivers.filter(d => d.status === 'available').map((driver) => (
          <MenuItem key={driver.id} onClick={() => handleAssignDriver(selectedCardId!, driver.id)}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={`${driver.name} (${driver.phone})`} />
          </MenuItem>
        ))}
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCard ? '콜카드 수정' : '새 콜카드 생성'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="제목"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="상차 위치"
            fullWidth
            variant="outlined"
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="하차 위치"
            fullWidth
            variant="outlined"
            value={formData.dropoffLocation}
            onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button onClick={editingCard ? handleUpdateCard : handleCreateCard} variant="contained">
            {editingCard ? '수정' : '생성'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}