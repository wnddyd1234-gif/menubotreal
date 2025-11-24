import React from 'react';
import { MenuRecommendation } from '../types';

interface Props {
  recommendations: MenuRecommendation[];
  onSelect: (dish: string) => void;
  onReset: () => void;
}

const Results: React.FC<Props> = ({ recommendations, onSelect, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            오늘의 점심 추천
          </h2>
          <p className="text-gray-400">사용자의 식사 패턴과 현재 환경을 분석한 결과입니다.</p>
        </div>
        <button 
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-white underline decoration-gray-600 hover:decoration-white underline-offset-4"
        >
          처음으로
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelect(rec.dishName)}
            className="group bg-card border border-gray-700 hover:border-primary rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:-translate-y-2 relative flex flex-col"
          >
            {/* Image Placeholder */}
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <img 
                src={`https://picsum.photos/400/300?random=${idx + rec.dishName.length}`} 
                alt={rec.dishName}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-4 z-20">
                <h3 className="text-xl font-bold text-white shadow-black drop-shadow-md">{rec.dishName}</h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1">
                {rec.reasoning}
              </p>
              
              <div className="flex items-center justify-between mt-4 border-t border-gray-700 pt-4">
                <span className="text-yellow-500 text-sm font-mono font-semibold">
                  {rec.calories}
                </span>
                <div className="flex gap-1">
                  {rec.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 rounded-md text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                선택하기
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;