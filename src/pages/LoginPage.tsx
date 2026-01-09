import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
  
    const result = await login(email, password);
    
    setIsLoading(false);

    if (typeof result === 'string') {
      setError(result);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">            
            <LogIn size={40} strokeWidth={1.5} />
          </div>
          <h1>Doktor Car</h1>
          <p>Bem-vindo de volta! Por favor, insira seus dados.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>       
      </div>
    </div>
  );
};

export default LoginPage;