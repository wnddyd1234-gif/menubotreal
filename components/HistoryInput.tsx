import React, { useState } from 'react';
import { MealHistory } from '../types';

interface Props {
  history: MealHistory;
  setHistory: (h: MealHistory) => void;
  onNext: () => void;
}

const FOOD_CATEGORIES = [
  { id: 'korean', name: '한식', keywords: 'korean,food' },
  { id: 'chinese', name: '중식', keywords: 'chinese,food' },
  { id: 'japanese', name: '일식', keywords: 'sushi,ramen' },
  { id: 'western', name: '양식', keywords: 'pasta,steak' },
  { id: 'chicken', name: '치킨', keywords: 'fried,chicken' },
  { id: 'burger', name: '피자/버거', keywords: 'burger,pizza' },
  { id: 'bunsik', name: '분식', keywords: 'tteokbokki' },
  { id: 'salad', name: '샐러드', keywords: 'salad,healthy' },
  { id: 'meat', name: '고기/구이', keywords: 'bbq,meat' },
  { id: 'soup', name: '찌개/탕', keywords: 'soup,stew' },
  { id: 'noodle', name: '면요리', keywords: 'noodle' },
  { id: 'rice', name: '밥/죽', keywords: 'rice,bowl' },
  { id: 'seafood', name: '해산물', keywords: 'seafood,fish' },
  { id: 'bread', name: '빵/샌드위치', keywords: 'bread,sandwich' },
  { id: 'asian', name: '아시안', keywords: 'pho,curry' },
];

const HistoryInput: React.FC<Props> = ({ history, setHistory, onNext }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Logic to determine which day needs input next
  const getNextEmptyDay = (): keyof MealHistory | null => {
    if (!history.day1) return 'day1';
    if (!history.day2) return 'day2';
    if (!history.day3) return 'day3';
    return null;
  };

  const handleSelect = (foodName: string) => {
    const targetDay = getNextEmptyDay();
    if (targetDay) {
      setHistory({ ...history, [targetDay]: foodName });
    }
  };

  const clearDay = (day: keyof MealHistory) => {
    setHistory({ ...history, [day]: '' });
  };

  const isComplete = history.day1 && history.day2 && history.day3;
  const filteredCategories = FOOD_CATEGORIES.filter(c => c.name.includes(searchTerm));

  const renderSlot = (day: keyof MealHistory, label: string) => {
    const value = history[day];
    const isNext = getNextEmptyDay() === day;
    
    return (
      <div 
        onClick={() => value && clearDay(day)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer w-1/3 relative ${
          value 
            ? 'border-secondary bg-secondary/10' 
            : isNext 
              ? 'border-primary bg-primary/10 animate-pulse-slow' 
              : 'border-gray-700 bg-gray-800'
        }`}
      >
        <span className="text-xs text-gray-400 mb-1">{label}</span>
        <div className="font-bold text-center truncate w-full h-6 flex items-center justify-center">
          {value || <span className="text-gray-600 text-sm">선택하기</span>}
        </div>
        {value && (
          <div className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 border border-gray-600">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          최근 3일간 드신 메뉴를 알려주세요
        </h2>
        <p className="text-gray-400 text-sm">
          3개 이상의 메뉴를 선택하여 사용자의 취향을 분석합니다.
        </p>
      </div>

      {/* Slots Header */}
      <div className="flex gap-4 mb-8 px-2">
        {renderSlot('day1', '어제')}
        {renderSlot('day2', '2일 전')}
        {renderSlot('day3', '3일 전')}
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-10 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />
        <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      {/* Circular Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-8 gap-x-4 mb-8">
        {filteredCategories.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => handleSelect(cat.name)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary group-hover:scale-105 transition-all duration-300 relative shadow-lg bg-gray-800">
               <img 
                 src={`https://loremflickr.com/200/200/${cat.keywords}`}
                 alt={cat.name}
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <span className="mt-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="sticky bottom-6 px-4">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`w-full py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform ${
            isComplete
              ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:scale-105'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isComplete ? '다음 단계로 이동' : '3일치 식단을 모두 선택해주세요'}
        </button>
      </div>
    </div>
  );
};

export default HistoryInput;