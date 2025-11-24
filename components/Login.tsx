
import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
  onCancel: () => void;
  initialMode?: 'login' | 'signup';
}

const Login: React.FC<Props> = ({ onLogin, onCancel, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Login Logic
    const mockUser: User = {
      name: name || '김미식',
      email: email || 'user@example.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'user'}`,
      apiKey: apiKey // Store the API key in the user object
    };
    onLogin(mockUser);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-card rounded-2xl border border-gray-700 shadow-2xl animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isLogin ? '로그인' : '회원가입'}
        </h2>
        <p className="text-gray-400 text-sm">
          점심천재 AI의 더 많은 기능을 이용해보세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
              placeholder="홍길동"
            />
          </div>
        )}
        <div>
          <label className="block text-sm text-gray-400 mb-1">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        
        {!isLogin && (
          <div>
            <label className="block text-sm text-primary mb-1 font-bold">Gemini API Key (선택사항)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-900 border border-primary/50 rounded-lg p-3 text-white focus:border-primary focus:outline-none placeholder-gray-600"
              placeholder="AI Studio API Key를 입력하세요"
            />
            <p className="text-xs text-gray-500 mt-1">
              본인의 API Key를 사용하려면 입력하세요. 미입력 시 기본 설정이 사용됩니다.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primary/80 text-white font-bold rounded-lg transition-colors mt-6"
        >
          {isLogin ? '로그인하기' : '가입하기'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline font-bold ml-1"
        >
          {isLogin ? '회원가입' : '로그인'}
        </button>
      </div>
      
      <button 
        onClick={onCancel}
        className="w-full mt-4 text-xs text-gray-500 hover:text-gray-300"
      >
        다음에 하기
      </button>
    </div>
  );
};

export default Login;
