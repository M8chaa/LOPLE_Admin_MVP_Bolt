import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalShipping as TruckIcon,
  Assignment as CallcardIcon,
  PersonAdd as AddDriverIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
  Notifications as NotificationIcon,
  Phone as PhoneIcon,
  Assignment as AssignIcon,
  Emergency as EmergencyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface CallcardData {
  id: number;
  title: string;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  driver?: { name: string };
  createdAt: string;
}

interface DriverData {
  id: number;
  name: string;
  status: string;
  phone: string;
  vehicleInfo?: string;
}

export default function DashboardPage() {
  const [callcards, setCallcards] = useState<CallcardData[]>([]);
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [callRes, driverRes] = await Promise.all([
          axios.get('http://localhost:4000/api/callcards', { headers }),
          axios.get('http://localhost:4000/api/drivers', { headers }),
        ]);
        setCallcards(callRes.data);
        setDrivers(driverRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Calculate metrics
  const pendingCallcards = callcards.filter(c => c.status === 'pending').length;
  const inProgressCallcards = callcards.filter(c => c.status === 'in_progress').length;
  const availableDrivers = drivers.filter(d => d.status === '대기중').length;
  const busyDrivers = drivers.filter(d => d.status === '운송중').length;
  const onTimeRate = callcards.length > 0 ? Math.round((inProgressCallcards / callcards.length) * 100) : 0;

  // Recent activity (last 5 callcards)
  const recentActivity = callcards
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Alerts and notifications
  const alerts = [
    { type: 'warning', message: `${pendingCallcards}개의 콜카드가 배차 대기 중입니다`, count: pendingCallcards },
    { type: 'info', message: `${availableDrivers}명의 운전기사가 대기 중입니다`, count: availableDrivers },
    ...(availableDrivers === 0 && pendingCallcards > 0 ? [{ type: 'error', message: '배차 가능한 운전기사가 없습니다!', count: 1 }] : [])
  ].filter(alert => alert.count > 0);

  const QuickActionButton = ({ icon: Icon, title, subtitle, onClick, color = 'primary', disabled = false }: any) => (
    <Card sx={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }} onClick={disabled ? undefined : onClick}>
      <CardContent sx={{ textAlign: 'center', py: 2 }}>
        <Icon sx={{ fontSize: 40, color: `${color}.main`, mb: 1 }} />
        <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>대시보드 로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            LOPLE 관제 대시보드
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <Badge badgeContent={alerts.length} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>
          <Chip 
            label={`실시간 업데이트 - ${new Date().toLocaleTimeString('ko-KR')}`} 
            size="small" 
            color="success" 
            variant="outlined" 
          />
        </Box>
      </Box>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {alerts.map((alert, index) => (
            <Alert key={index} severity={alert.type as any} sx={{ mb: 1 }}>
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <CallcardIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">{callcards.length}</Typography>
            <Typography variant="h6">총 콜카드</Typography>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-around' }}>
              <Box>
                <Typography variant="body2">대기: {pendingCallcards}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">진행: {inProgressCallcards}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <TruckIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">{drivers.length}</Typography>
            <Typography variant="h6">총 운전기사</Typography>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-around' }}>
              <Box>
                <Typography variant="body2">대기: {availableDrivers}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">운송: {busyDrivers}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
            <TrendingIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">{onTimeRate}%</Typography>
            <Typography variant="h6">배차율</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              진행중 / 전체 콜카드
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
            <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">{pendingCallcards}</Typography>
            <Typography variant="h6">대기 콜카드</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              배차 필요
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            빠른 작업
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionButton
            icon={AddIcon}
            title="새 콜카드"
            subtitle="배송 요청 생성"
            onClick={() => navigate('/callcards')}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionButton
            icon={AssignIcon}
            title="운전기사 배차"
            subtitle="대기 콜카드 배정"
            onClick={() => navigate('/callcards')}
            color="success"
            disabled={pendingCallcards === 0}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionButton
            icon={AddDriverIcon}
            title="기사 관리"
            subtitle="운전기사 현황"
            onClick={() => navigate('/drivers')}
            color="info"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionButton
            icon={PhoneIcon}
            title="긴급 연락"
            subtitle="운전기사 연락"
            onClick={() => navigate('/drivers')}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionButton
            icon={EmergencyIcon}
            title="사고 신고"
            subtitle="응급 상황 처리"
            onClick={() => alert('사고 신고 기능은 추후 구현 예정입니다.')}
            color="error"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionButton
            icon={TrendingIcon}
            title="보고서"
            subtitle="성과 분석"
            onClick={() => alert('보고서 기능은 추후 구현 예정입니다.')}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              최근 활동
            </Typography>
            <List dense>
              {recentActivity.length === 0 ? (
                <ListItem>
                  <ListItemText primary="활동 내역이 없습니다." />
                </ListItem>
              ) : (
                recentActivity.map((card) => (
                  <React.Fragment key={card.id}>
                    <ListItem>
                      <ListItemIcon>
                        {card.status === 'pending' ? (
                          <ScheduleIcon color="warning" />
                        ) : card.status === 'in_progress' ? (
                          <TruckIcon color="success" />
                        ) : (
                          <CheckIcon color="primary" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={card.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {card.pickupLocation} → {card.dropoffLocation}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={card.status === 'pending' ? '대기중' : card.status === 'in_progress' ? '진행중' : '완료'} 
                                size="small" 
                                color={card.status === 'pending' ? 'warning' : card.status === 'in_progress' ? 'success' : 'primary'}
                              />
                              {card.driver && (
                                <Chip label={card.driver.name} size="small" variant="outlined" />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={() => navigate('/callcards')} variant="outlined">
                모든 콜카드 보기
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Driver Status Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              운전기사 현황
            </Typography>
            <List dense>
              {drivers.length === 0 ? (
                <ListItem>
                  <ListItemText primary="등록된 운전기사가 없습니다." />
                </ListItem>
              ) : (
                drivers.map((driver) => (
                  <React.Fragment key={driver.id}>
                    <ListItem>
                      <ListItemIcon>
                        <TruckIcon color={driver.status === '대기중' ? 'success' : 'warning'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={driver.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={driver.status} 
                              size="small" 
                              color={driver.status === '대기중' ? 'success' : 'warning'}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {driver.phone}
                            </Typography>
                          </Box>
                        }
                      />
                      <IconButton size="small" onClick={() => window.open(`tel:${driver.phone}`)}>
                        <PhoneIcon />
                      </IconButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={() => navigate('/drivers')} variant="outlined">
                운전기사 관리
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}