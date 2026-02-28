'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
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
  Tabs,
  Tab,
  Paper,
  Divider,
  Tooltip,
  Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SettingsIcon from '@mui/icons-material/Settings';
import Header from '../../../components/Header/Header';
import { AudioProvider, useAudio } from '../../../components/AudioProvider/AudioProvider';
import PitchDetector from '../../../components/PitchDetector/PitchDetector';
import {
  TWELVE_WEEK_PROGRAM,
  WeeklyPlan,
  UserProgress,
  DailyProgress,
  initializeProgress,
  loadProgress,
  saveProgress,
  getCurrentWeekNumber,
  isTodayComplete,
  getPracticeStreak,
  getTotalPracticeTime,
  WaveformType,
} from '../../../lib/earTraining';
import { useTranslations } from 'next-intl';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function DroneControl() {
  const { startDrone, stopDrone, isDronePlaying, playDegree, playMajorTriad, playMinorTriad } = useAudio();
  const [currentKey, setCurrentKey] = useState('C');
  const [octave, setOctave] = useState(3);
  const [waveform, setWaveform] = useState<WaveformType>('triangle');
  const t = useTranslations('earTraining');

  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MusicNoteIcon /> {t('droneControl')}
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('key')}</InputLabel>
              <Select
                value={currentKey}
                label={t('key')}
                onChange={(e) => setCurrentKey(e.target.value)}
              >
                {keys.map(key => (
                  <MenuItem key={key} value={key}>{key}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('octave')}</InputLabel>
              <Select
                value={octave}
                label={t('octave')}
                onChange={(e) => setOctave(Number(e.target.value))}
              >
                {[2, 3, 4].map(o => (
                  <MenuItem key={o} value={o}>{o}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('waveform')}</InputLabel>
              <Select
                value={waveform}
                label={t('waveform')}
                onChange={(e) => setWaveform(e.target.value as WaveformType)}
              >
                <MenuItem value="sine">{t('sine')}</MenuItem>
                <MenuItem value="triangle">{t('triangle')}</MenuItem>
                <MenuItem value="square">{t('square')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={4}>
            <Button
              variant={isDronePlaying ? 'outlined' : 'contained'}
              color={isDronePlaying ? 'error' : 'primary'}
              startIcon={isDronePlaying ? <StopIcon /> : <PlayArrowIcon />}
              onClick={() => isDronePlaying ? stopDrone() : startDrone(currentKey, octave, waveform)}
              fullWidth
            >
              {isDronePlaying ? t('stopDrone') : t('startDrone')}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          {t('playDegrees')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7].map(degree => (
            <Button
              key={degree}
              variant="outlined"
              size="small"
              onClick={() => playDegree(currentKey, octave, degree, 1.5, waveform)}
            >
              {degree} ({['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'][degree - 1]})
            </Button>
          ))}
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          {t('playChords')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => playMajorTriad(currentKey, octave)}
          >
            {t('majorTriad')}
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => playMinorTriad(currentKey, octave)}
          >
            {t('minorTriad')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function WeekCard({ plan, isCurrentWeek, onComplete }: { 
  plan: WeeklyPlan; 
  isCurrentWeek: boolean;
  onComplete: (blocks: number[]) => void;
}) {
  const [completedBlocks, setCompletedBlocks] = useState<number[]>([]);
  const t = useTranslations('earTraining');

  const toggleBlock = (index: number) => {
    setCompletedBlocks(prev => {
      const newBlocks = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      return newBlocks;
    });
  };

  const handleMarkComplete = () => {
    onComplete(completedBlocks);
    setCompletedBlocks([]);
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        border: isCurrentWeek ? '2px solid' : '1px solid',
        borderColor: isCurrentWeek ? 'primary.main' : 'divider',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6">
              {t('week')} {plan.week}: {plan.focus}
            </Typography>
            {isCurrentWeek && (
              <Chip label={t('currentWeek')} color="primary" size="small" sx={{ mt: 0.5 }} />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            ~{plan.blocks.reduce((sum, b) => sum + b.duration, 0)} {t('minutes')}
          </Typography>
        </Box>

        {plan.blocks.map((block, idx) => (
          <Accordion key={idx} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Checkbox
                  size="small"
                  checked={completedBlocks.includes(idx)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBlock(idx);
                  }}
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  color="success"
                  sx={{ p: 0.5 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    {t('block')} {idx + 1}: {block.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {block.duration} {t('minutes')} — {block.description}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {block.exercises.map((exercise, exIdx) => (
                  <ListItem key={exIdx}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Typography variant="body2" color="text.secondary">
                        {exIdx + 1}.
                      </Typography>
                    </ListItemIcon>
                    <ListItemText primary={exercise} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}

        {plan.tips.length > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>{t('tips')}:</Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {plan.tips.map((tip, idx) => (
                <li key={idx}><Typography variant="body2">{tip}</Typography></li>
              ))}
            </ul>
          </Alert>
        )}

        {isCurrentWeek && completedBlocks.length > 0 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleMarkComplete}
            >
              {t('markDayComplete')} ({completedBlocks.length}/{plan.blocks.length} {t('blocks')})
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressStats({ progress }: { progress: UserProgress }) {
  const t = useTranslations('earTraining');
  const streak = getPracticeStreak(progress);
  const totalTime = getTotalPracticeTime(progress);
  const completedDays = progress.dailyLogs.filter(l => l.completed).length;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <LocalFireDepartmentIcon color="error" sx={{ fontSize: 32 }} />
          <Typography variant="h4">{streak}</Typography>
          <Typography variant="caption" color="text.secondary">{t('dayStreak')}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <CalendarTodayIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4">{completedDays}</Typography>
          <Typography variant="caption" color="text.secondary">{t('daysCompleted')}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <TimerIcon color="success" sx={{ fontSize: 32 }} />
          <Typography variant="h4">{Math.round(totalTime / 60) || totalTime}</Typography>
          <Typography variant="caption" color="text.secondary">
            {totalTime >= 60 ? t('hoursTotal') : t('minutesTotal')}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <TrendingUpIcon color="info" sx={{ fontSize: 32 }} />
          <Typography variant="h4">{progress.currentWeek}/12</Typography>
          <Typography variant="caption" color="text.secondary">{t('currentWeekProgress')}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

function EarTrainingContent() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const t = useTranslations('earTraining');

  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setProgress(saved);
    } else {
      const initial = initializeProgress();
      setProgress(initial);
      saveProgress(initial);
    }
  }, []);

  const handleDayComplete = (blocksCompleted: number[]) => {
    if (!progress) return;

    const today = new Date().toISOString().split('T')[0];
    const todayLog: DailyProgress = {
      date: today,
      completed: true,
      blocksCompleted,
      notes: '',
      duration: blocksCompleted.length * 5, // Approximate 5 min per block
    };

    const updatedProgress = {
      ...progress,
      dailyLogs: [...progress.dailyLogs.filter(l => l.date !== today), todayLog],
      currentWeek: getCurrentWeekNumber(progress.startDate),
    };

    setProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const handleResetProgress = () => {
    const initial = initializeProgress();
    setProgress(initial);
    saveProgress(initial);
    setSettingsOpen(false);
  };

  if (!progress) {
    return <LinearProgress />;
  }

  const currentWeekPlan = TWELVE_WEEK_PROGRAM[progress.currentWeek - 1] || TWELVE_WEEK_PROGRAM[0];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
          color: 'white',
          pt: { xs: 10, md: 12 },
          pb: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            🎵 {t('title')}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {t('subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <ProgressStats progress={progress} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title={t('settings')}>
            <IconButton onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label={t('practice')} />
            <Tab label={t('program')} />
            <Tab label={t('strudelPatterns')} />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>{t('todaysFocus')}:</strong> {t('week')} {progress.currentWeek} — {currentWeekPlan.focus}
            </Typography>
          </Alert>

          <WeekCard 
            plan={currentWeekPlan} 
            isCurrentWeek={true}
            onComplete={handleDayComplete}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            📻 {t('practiceTools')}
          </Typography>

          <DroneControl />
          
          <PitchDetector 
            targetNote={progress.settings.preferredKey}
            targetOctave={3}
            labels={{
              title: t('pitchDetector.title'),
              start: t('pitchDetector.start'),
              stop: t('pitchDetector.stop'),
              inTune: t('pitchDetector.inTune'),
              sharp: t('pitchDetector.sharp'),
              flat: t('pitchDetector.flat'),
              permissionDenied: t('pitchDetector.permissionDenied'),
              clickToStart: t('pitchDetector.clickToStart'),
              helpText: t('pitchDetector.helpText'),
              target: t('pitchDetector.target'),
            }}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom>{t('fullProgram')}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('programDescription')}
          </Typography>
          
          {TWELVE_WEEK_PROGRAM.map((plan) => (
            <WeekCard 
              key={plan.week}
              plan={plan}
              isCurrentWeek={plan.week === progress.currentWeek}
              onComplete={handleDayComplete}
            />
          ))}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" gutterBottom>{t('strudelIntegration')}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('strudelDescription')}
          </Typography>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🎹 {t('dronePatternTitle')}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('dronePatternDesc')}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'white', fontFamily: 'monospace', fontSize: 14 }}>
                <code>
                  {`note("c3").sound("triangle").sustain(8).gain(0.3).slow(8)`}
                </code>
              </Paper>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 1 }}
                onClick={() => window.open('https://strudel.cc/?OGV0YnMwc3FiMDAwMHAwMDAwMDAwMDAwMG4oImMzIikuc291bmQoInRyaWFuZ2xlIikuc3VzdGFpbig4KS5nYWluKDAuMykuc2xvdyg4KQ%3D%3D', '_blank')}
              >
                {t('openInStrudel')}
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🎵 {t('degreesPatternTitle')}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('degreesPatternDesc')}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'white', fontFamily: 'monospace', fontSize: 14 }}>
                <code>
                  {`note("c3 e3 g3 c4").sound("piano").slow(4)`}
                </code>
              </Paper>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 1 }}
                onClick={() => window.open('https://strudel.cc/?OGVuMXJsMXI0YjAwMHAwMDAwMDAwMDAwMG4oImMzIGUzIGczIGM0Iikuc291bmQoInBpYW5vIikuc2xvdyg0KQ%3D%3D', '_blank')}
              >
                {t('openInStrudel')}
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🎼 {t('majorMinorPatternTitle')}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('majorMinorPatternDesc')}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'white', fontFamily: 'monospace', fontSize: 14, mb: 1 }}>
                <code>
                  {`// Major triad\nstack(note("c3"), note("e3"), note("g3")).sound("piano").slow(2)`}
                </code>
              </Paper>
              <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'white', fontFamily: 'monospace', fontSize: 14 }}>
                <code>
                  {`// Minor triad\nstack(note("c3"), note("eb3"), note("g3")).sound("piano").slow(2)`}
                </code>
              </Paper>
            </CardContent>
          </Card>

          <Alert severity="success">
            <Typography variant="body2">
              💡 <strong>{t('tip')}:</strong> {t('strudelTip')}
            </Typography>
          </Alert>
        </TabPanel>
      </Container>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>{t('settings')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('settingsDescription')}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('preferredKey')}</InputLabel>
            <Select
              value={progress.settings.preferredKey}
              label={t('preferredKey')}
              onChange={(e) => {
                const updated = {
                  ...progress,
                  settings: { ...progress.settings, preferredKey: e.target.value }
                };
                setProgress(updated);
                saveProgress(updated);
              }}
            >
              {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(key => (
                <MenuItem key={key} value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="error" gutterBottom>
            {t('dangerZone')}
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleResetProgress}
          >
            {t('resetProgress')}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function EarTrainingPage() {
  return (
    <AudioProvider>
      <EarTrainingContent />
    </AudioProvider>
  );
}
