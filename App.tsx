
import React, { useState } from 'react';
import { AppStep, MealHistory, WeatherCondition, LocationData, MenuRecommendation, User } from './types';
import { analyzeMenuPreferences } from './services/geminiService';
import HistoryInput from './components/HistoryInput';
import ContextInput from './components/ContextInput';
import Results from './components/Results';
import MapFinder from './components/MapFinder';
import Login from './components/Login';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.HISTORY_INPUT);
  const [previousStep, setPreviousStep] = useState<AppStep>(AppStep.HISTORY_INPUT);
  
  // User State
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // App Data State
  const [history, setHistory] = useState<MealHistory>({ day1: '', day2: '', day3: '' });
  const [weather, setWeather] = useState<WeatherCondition>(WeatherCondition.SUNNY);
  const [location, setLocation] = useState<LocationData | null>(null);
  
  // Results
  const [recommendations, setRecommendations] = useState<MenuRecommendation[]>([]);
  const [selectedDish, setSelectedDish] = useState<string>("");

  const handleAnalyze = async () => {
    if (!location) return;
    setStep(AppStep.ANALYZING);
    
    try {
      const results = await analyzeMenuPreferences(history, weather, location, user?.apiKey);
      setRecommendations(results);
      setStep(AppStep.RESULTS);
    } catch (error) {
      console.error("Analysis failed", error);
      // In a real app, show error toast
      setStep(AppStep.CONTEXT_INPUT);
    }
  };

  const handleDishSelection = (dish: string) => {
    setSelectedDish(dish);
    setStep(AppStep.FINDING_RESTAURANTS);
  };

  const handleReset = () => {
    setStep(AppStep.HISTORY_INPUT);
    setRecommendations([]);
    setSelectedDish("");
    setHistory({ day1: '', day2: '', day3: '' });
  };

  const goToLogin = (mode: 'login' | 'signup') => {
    setPreviousStep(step === AppStep.LOGIN || step === AppStep.PROFILE ? AppStep.HISTORY_INPUT : step);
    setAuthMode(mode);
    setStep(AppStep.LOGIN);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setStep(previousStep);
  };

  const handleLogout = () => {
    setUser(null);
    setStep(AppStep.HISTORY_INPUT);
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100 flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-gray-800 sticky top-0 bg-dark/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setStep(AppStep.HISTORY_INPUT)}
          >
            <span className="text-3xl">🍱</span>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              점심천재 AI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  setPreviousStep(step);
                  setStep(AppStep.PROFILE);
                }}
              >
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {user.name}님
                </span>
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => goToLogin('login')}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  로그인
                </button>
                <button 
                  onClick={() => goToLogin('signup')}
                  className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-12">
        
        {step === AppStep.LOGIN && (
          <Login 
            initialMode={authMode} 
            onLogin={handleLogin} 
            onCancel={() => setStep(previousStep)} 
          />
        )}

        {step === AppStep.PROFILE && user && (
          <Profile 
            user={user} 
            history={history} 
            onLogout={handleLogout} 
            onBack={() => setStep(previousStep)} 
          />
        )}
        
        {step === AppStep.HISTORY_INPUT && (
          <HistoryInput 
            history={history} 
            setHistory={setHistory} 
            onNext={() => setStep(AppStep.CONTEXT_INPUT)} 
          />
        )}

        {step === AppStep.CONTEXT_INPUT && (
          <ContextInput 
            weather={weather}
            setWeather={setWeather}
            setLocation={(loc) => setLocation(loc)}
            onAnalyze={handleAnalyze}
          />
        )}

        {step === AppStep.ANALYZING && (
          <div className="flex flex-col items-center justify-center h-[50vh]">
             <div className="relative w-24 h-24 mb-8">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">분석 중...</h2>
             <p className="text-gray-400 max-w-md text-center animate-pulse-slow">
               Gemini가 {history.day1}, {history.day2} 등 과거 식단과 현재 날씨({weather})를 분석하여 최적의 메뉴를 찾고 있습니다.
             </p>
          </div>
        )}

        {step === AppStep.RESULTS && (
          <Results 
            recommendations={recommendations} 
            onSelect={handleDishSelection}
            onReset={handleReset}
          />
        )}

        {step === AppStep.FINDING_RESTAURANTS && location && (
          <MapFinder 
            dishName={selectedDish} 
            location={location}
            onBack={() => setStep(AppStep.RESULTS)}
            apiKey={user?.apiKey}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 text-sm">
        <p>Powered by Google Gemini 2.5 Flash • 위치 권한 필요</p>
      </footer>
    </div>
  );
};

export default App;
