import React, { useState, useEffect } from 'react';
import { Users, UserCog, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

import CreateUserModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ users: User[] }>('/users');

      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Falha ao buscar usuários:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await api.post('/users', userData);
      setIsCreateModalOpen(false);
      fetchUsers();
      alert('Usuário criado com sucesso!');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro desconhecido';
      alert('Erro ao criar usuário: ' + msg);
    }
  };

  const handleUpdateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      const response = await api.patch<{ user: User }>(`/users/${userId}`, updatedData);
      setUsers(current => current.map(u => (u._id === userId ? response.data.user : u)));
      setIsEditModalOpen(false);
      alert('Usuário atualizado com sucesso!');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro desconhecido';
      alert('Erro ao atualizar usuário: ' + msg);
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === user?.id) {
      alert("Você não pode excluir sua própria conta.");
      return;
    }

    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(current => current.filter(u => u._id !== userId));
        alert('Usuário deletado com sucesso!');
      } catch (error) {
        alert('Não foi possível deletar o usuário.');
      }
    }
  };

  const openEditModal = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setIsEditModalOpen(true);
  };

  const adminCount = users.filter(u => u.role === 'admin').length;
  const collabCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="header-left">
            <UserCog className="header-icon" />
            <h1>Painel do Administrador</h1>
          </div>
          <button onClick={logout} className="logout-button" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <LogOut className="icon-sm" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h2>Bem-vindo(a), {user?.name}!</h2>
          <p className="welcome-subtitle">Gerencie os usuários e permissões do sistema.</p>
        </section>

        <div className="stats-grid">
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-content">
              <p className="stat-label">Colaboradores</p>
              <strong className="stat-value">{collabCount}</strong>
            </div>
          </div>
          <div className="stat-card">
            <UserCog className="stat-icon" />
            <div className="stat-content">
              <p className="stat-label">Administradores</p>
              <strong className="stat-value">{adminCount}</strong>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p>Carregando usuários...</p>
        ) : (
          <section className="users-section">
            <div className="section-header">
              <h3>Usuários Cadastrados</h3>
              <button onClick={() => setIsCreateModalOpen(true)} className="create-button" >
                <Plus className="icon-sm"/> Novo Usuário
              </button>
            </div>

            {users.length > 0 ? (
              users.map((u) => (
                <div key={u._id} className="user-card">
                  <div className="user-info">
                    <div className="user-avatar" style={{ backgroundColor: u.role === 'admin' ? '#666666' : '#1A1A1A' }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <p className="user-name">{u.name}</p>
                      <p className="user-email">{u.email}</p>
                      <span className={`user-role-badge role-${u.role}`}>{u.role}</span>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button onClick={() => openEditModal(u)} className="edit-button">Editar</button>
                    <button onClick={() => handleDelete(u._id)} className="delete-button">Excluir</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message" >Nenhum usuário encontrado.</p>
            )}
          </section>
        )}
      </main>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={handleCreateUser}
      />

      {editingUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          userToEdit={editingUser}
          onUserUpdated={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;