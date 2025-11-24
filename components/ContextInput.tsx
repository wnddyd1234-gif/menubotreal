import React, { useState, useEffect } from 'react';
import { WeatherCondition, LocationData } from '../types';

interface Props {
  weather: WeatherCondition;
  setWeather: (w: WeatherCondition) => void;
  setLocation: (l: LocationData) => void;
  onAnalyze: () => void;
}

const ContextInput: React.FC<Props> = ({ weather, setWeather, setLocation, onAnalyze }) => {
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Auto-fetch location on mount
    setLocStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocStatus('success');
        },
        (err) => {
          console.error(err);
          setLocStatus('error');
        }
      );
    } else {
      setLocStatus('error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once

  const weatherOptions = [
    { type: WeatherCondition.SUNNY, icon: '☀️', label: '맑음' },
    { type: WeatherCondition.CLOUDY, icon: '☁️', label: '흐림' },
    { type: WeatherCondition.RAINY, icon: '🌧️', label: '비' },
    { type: WeatherCondition.SNOWY, icon: '❄️', label: '눈' },
    { type: WeatherCondition.HOT, icon: '🔥', label: '무더위' },
    { type: WeatherCondition.COLD, icon: '🥶', label: '추움' },
  ];

  return (
    <div className="max-w-md mx-auto bg-card p-8 rounded-2xl shadow-2xl border border-gray-800 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-teal-400 mb-2">
        현재 상황
      </h2>
      <p className="text-gray-400 mb-6 text-sm">
        AI가 주변 환경을 이해할 수 있도록 도와주세요.
      </p>

      <div className="mb-8">
        <label className="block text-gray-300 text-sm font-semibold mb-3">현재 날씨는 어떤가요?</label>
        <div className="grid grid-cols-3 gap-3">
          {weatherOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setWeather(opt.type)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                weather === opt.type
                  ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-600'
              }`}
            >
              <span className="text-2xl mb-1">{opt.icon}</span>
              <span className="text-xs font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-300 font-semibold block">위치 정보 접근</span>
          <span className="text-xs text-gray-500">
            {locStatus === 'loading' && '위치 확인 중...'}
            {locStatus === 'success' && '위치 확인 완료'}
            {locStatus === 'error' && '위치 접근 실패'}
            {locStatus === 'idle' && '대기 중...'}
          </span>
        </div>
        <div className="h-3 w-3 rounded-full relative">
           {locStatus === 'loading' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>}
           <span className={`relative inline-flex rounded-full h-3 w-3 ${
             locStatus === 'success' ? 'bg-green-500' : 
             locStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
           }`}></span>
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={locStatus !== 'success'}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
          locStatus === 'success'
            ? 'bg-gradient-to-r from-secondary to-teal-600 hover:scale-105 text-white shadow-lg shadow-teal-500/30'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <span>메뉴 추천받기</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </button>
      {locStatus === 'error' && (
        <p className="text-red-400 text-xs mt-3 text-center">원활한 추천을 위해 위치 권한을 허용해주세요.</p>
      )}
    </div>
  );
};

export default ContextInput;