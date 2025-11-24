import React from 'react';
import { User, MealHistory } from '../types';

interface Props {
  user: User;
  history: MealHistory;
  onLogout: () => void;
  onBack: () => void;
}

const Profile: React.FC<Props> = ({ user, history, onLogout, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        돌아가기
      </button>

      <div className="bg-card rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-primary to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end">
              <div className="w-24 h-24 rounded-full border-4 border-card overflow-hidden bg-gray-800">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 mb-1">
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
            >
              로그아웃
            </button>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">최근 식사 기록</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl text-center">
                <span className="block text-xs text-gray-500 mb-1">어제</span>
                <span className="font-bold text-primary">{history.day1 || '-'}</span>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl text-center">
                <span className="block text-xs text-gray-500 mb-1">2일 전</span>
                <span className="font-bold text-primary">{history.day2 || '-'}</span>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl text-center">
                <span className="block text-xs text-gray-500 mb-1">3일 전</span>
                <span className="font-bold text-primary">{history.day3 || '-'}</span>
              </div>
            </div>
            {(!history.day1 && !history.day2 && !history.day3) && (
              <p className="text-center text-sm text-gray-500 mt-2">아직 기록된 식사가 없습니다.</p>
            )}
          </div>
          
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">나의 미식 등급</h3>
            <div className="flex items-center bg-gray-800/50 p-4 rounded-xl">
               <span className="text-3xl mr-4">🥉</span>
               <div>
                 <p className="font-bold text-white">입문 미식가</p>
                 <p className="text-xs text-gray-400">더 많은 식사 기록을 남기고 등급을 올려보세요!</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;