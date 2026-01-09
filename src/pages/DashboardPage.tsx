import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, Clock, Settings, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

type ClockStatus = 'NOT_STARTED' | 'CLOCKED_IN' | 'ON_LUNCH' | 'BACK_FROM_LUNCH' | 'CLOCKED_OUT';

interface ClockRecord {
  clockInTime?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  clockOutTime?: string;
  dailyTasks?: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState<ClockStatus>('NOT_STARTED');
  const [dailyTasks, setDailyTasks] = useState<string>('');
  const [currentRecord, setCurrentRecord] = useState<ClockRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoursWorked, setHoursWorked] = useState<string>('00:00:00');

  const fetchStatus = async () => {
    try {
      const response = await api.get('/time-tracking/today');
      setStatus(response.data.status);
      if (response.data.record) {
        setCurrentRecord(response.data.record);
        setDailyTasks(response.data.record.dailyTasks || '');
      }
    } catch (error) {
      console.error("Erro ao buscar status:", error);
      setStatus('NOT_STARTED');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);
  
  useEffect(() => {
    const updateHoursWorked = () => {
      if (!currentRecord?.clockInTime || status === 'NOT_STARTED') {
        setHoursWorked('00:00:00');
        return;
      }
      
      const now = new Date();
      const clockIn = new Date(currentRecord.clockInTime);
      let lunchMs = 0;

      if (currentRecord.lunchStartTime) {
        const lunchStart = new Date(currentRecord.lunchStartTime);
        const lunchEnd = currentRecord.lunchEndTime
          ? new Date(currentRecord.lunchEndTime)
          : (status === 'ON_LUNCH' ? now : lunchStart);
        lunchMs = lunchEnd.getTime() - lunchStart.getTime();
      }
      
      const endPoint = currentRecord.clockOutTime
        ? new Date(currentRecord.clockOutTime)
        : (status !== 'CLOCKED_OUT' ? now : clockIn);

      let workedMs = endPoint.getTime() - clockIn.getTime() - lunchMs;
      workedMs = Math.max(0, workedMs);

      const totalSeconds = Math.floor(workedMs / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);
      setHoursWorked(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };

    const interval = setInterval(updateHoursWorked, 1000);
    return () => clearInterval(interval);
  }, [currentRecord, status]);

  const performAction = async (action: string, payload = {}) => {
    try {
      await api.post(`/time-tracking/${action}`, payload);
      await fetchStatus();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao processar ponto.');
    }
  };

  const handleClockOut = () => {
    if (!dailyTasks.trim()) {
      alert('Por favor, descreva as tarefas antes de finalizar.');
      return;
    }
    performAction('clock-out', { dailyTasks });
  };

  const getStatusText = () => {
    const texts: Record<ClockStatus, string> = {
      NOT_STARTED: 'Aguardando início',
      CLOCKED_IN: 'Trabalhando',
      ON_LUNCH: 'Em Almoço',
      BACK_FROM_LUNCH: 'Trabalhando (Pós-Almoço)',
      CLOCKED_OUT: 'Expediente Finalizado'
    };
    return texts[status] || status;
  };

  const renderButtons = () => {
    if (isLoading) return <button disabled className="main-action-button">Carregando...</button>;
    switch (status) {
      case 'NOT_STARTED':
        return <button onClick={() => performAction('clock-in')} className="main-action-button">Registrar Entrada</button>;
      case 'CLOCKED_IN':
        return (
          <div className="action-buttons-group">
            <button onClick={() => performAction('lunch-start')} className="main-style-button">Iniciar Almoço</button>
            <button onClick={handleClockOut} className="danger-style-button">Finalizar Expediente</button>
          </div>
        );
      case 'ON_LUNCH':
        return <button onClick={() => performAction('lunch-end')} className="main-action-button">Finalizar Almoço</button>;
      case 'BACK_FROM_LUNCH':        
        return <button onClick={handleClockOut} className="danger-style-button">Finalizar Expediente</button>;
      case 'CLOCKED_OUT':
        return <div className="status-finalized">🎉 Bom descanso! Até amanhã.</div>;
      default:
        return null;
    }
  };
  
  const formatTime = (dateString?: string) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <Briefcase className="header-icon" />
            <h1>Painel do Colaborador</h1>
          </div>
          <div className="header-right">
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/admin/users')} className="admin-button" title="Ir para Admin">
                <Settings className="icon-sm" />
              </button>
            )}
            <button onClick={logout} className="logout-button">
              <LogOut className="icon-sm" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Olá, {user?.name}!</h2>
        </div>

        <div className="dashboard-grid">
          <div className="status-card">
            <div className="card-header">
              <Clock className="status-icon" />
              <span>Status Atual</span>
            </div>
            <p className={`status-badge ${status.toLowerCase()}`}>{getStatusText()}</p>

            <div className="hours-counter">
              <p>Tempo de Trabalho</p>
              <div className="hours-display">{hoursWorked}</div>
            </div>
          </div>

          <div className="report-section">
            <h3>Relatório de Tarefas</h3>
            <textarea
              value={dailyTasks}
              onChange={(e) => setDailyTasks(e.target.value)}
              placeholder="O que você realizou hoje?"
              className="report-textarea"
              disabled={status === 'CLOCKED_OUT'}
            />
          </div>
        </div>

        <div className="action-section">
          {renderButtons()}
        </div>

        {currentRecord && (
          <div className="timeline-section">
            <h3>Registros de Hoje</h3>
            <div className="timeline-grid">
              <div className="timeline-item">
                <span className="timeline-label">Entrada:</span>
                <span className="timeline-value">{formatTime(currentRecord.clockInTime)}</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Início Almoço:</span>
                <span className="timeline-value">{formatTime(currentRecord.lunchStartTime)}</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Fim Almoço:</span>
                <span className="timeline-value">{formatTime(currentRecord.lunchEndTime)}</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Saída:</span>
                <span className="timeline-value">{formatTime(currentRecord.clockOutTime)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;