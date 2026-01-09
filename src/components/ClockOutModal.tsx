import React, { useState, ChangeEvent } from 'react';

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tasks: string) => void;
}

const ClockOutModal: React.FC<ClockOutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [dailyTasks, setDailyTasks] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = (): void => {
    const trimmedTasks = dailyTasks.trim();

    if (!trimmedTasks) {
      setError('O relatório de tarefas não pode estar em branco.');
      return;
    }

    onConfirm(trimmedTasks);
    setDailyTasks('');
    setError('');
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setDailyTasks(e.target.value);

    if (error) {
      setError('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Tarefas Realizadas Hoje</h2>
        <textarea
          placeholder="Descreva as tarefas que você realizou..."
          value={dailyTasks}
          onChange={handleTextChange}
        />
        
        {error && <p className="error-message-modal" style={{ color: 'red' }}>{error}</p>}
        
        <div className="modal-actions">
          <button 
            type="button" 
            onClick={onClose} 
            className="secondary"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={handleConfirm}
          >
            Confirmar Saída
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClockOutModal;