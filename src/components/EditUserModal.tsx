import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null;
  onUserUpdated: (userId: string, updatedData: any) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, userToEdit, onUserUpdated }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  });
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        role: userToEdit.role || 'user',
      });
      setPassword('');
      setError('');
    }
  }, [isOpen, userToEdit]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userToEdit?._id) {
      setError("Não foi possível encontrar o ID do usuário.");
      return;
    }

    const dataToSend: any = { ...formData };

    if (password.trim() !== '') {
      if (password.length < 6) {
        setError('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
      dataToSend.password = password;
    }

    onUserUpdated(userToEdit._id, dataToSend);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>Editar Usuário</h2>
          <button onClick={onClose} className="modal-close">
            <X className="icon-sm"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">      
          <div className="form-group">
            <label htmlFor="name-edit">Nome</label>
            <input
              id="name-edit"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-edit">Email</label>
            <input
              id="email-edit"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-edit">Nova Senha (Opcional)</label>
            <input
              id="password-edit"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe em branco para manter a atual"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role-edit">Cargo (Role)</label>
            <select
              id="role-edit"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="user">Colaborador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '25px', display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} className="secondary">
              Cancelar
            </button>
            <button type="submit" className="primary">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;