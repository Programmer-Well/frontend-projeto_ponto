import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (userData: CreateUserData) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

   
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

   
    onUserCreated({ name, email, password, role });
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ textAlign: 'left' }}
      >
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Criar Novo Usuário</h2>
          <button onClick={onClose} className="modal-close" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <p className="error-message" style={{ color: '#dc3545', marginBottom: '15px' }}>{error}</p>}
          
          <div className="form-group">
            <label htmlFor="create-name">Nome</label>
            <input 
              id="create-name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nome completo"
              required 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-email">Email</label>
            <input 
              id="create-email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="email@empresa.com"
              required
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-password">Senha</label>
            <input 
              id="create-password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Mínimo 6 caracteres"
              required 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-role">Cargo (Role)</label>
            <select 
              id="create-role"
              value={role} 
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              className="form-input"
            >
              <option value="user">Colaborador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '25px', display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} className="secondary">
              Cancelar
            </button>
            <button type="submit" className="primary">
              Criar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;