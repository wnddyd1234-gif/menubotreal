
import React, { useEffect, useState } from 'react';
import { LocationData, RestaurantResult } from '../types';
import { findRestaurantsForDish } from '../services/geminiService';

interface Props {
  dishName: string;
  location: LocationData;
  onBack: () => void;
  apiKey?: string;
}

const MapFinder: React.FC<Props> = ({ dishName, location, onBack, apiKey }) => {
  const [status, setStatus] = useState<'searching' | 'done'>('searching');
  const [results, setResults] = useState<RestaurantResult[]>([]);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      const data = await findRestaurantsForDish(dishName, location, apiKey);
      setAiMessage(data.text);
      setResults(data.places);
      setStatus('done');
    };
    fetchPlaces();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        메뉴로 돌아가기
      </button>

      {status === 'searching' ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <h3 className="text-xl font-bold text-gray-200">주변 맛집을 검색하고 있습니다...</h3>
          <p className="text-gray-500">{dishName} 맛집 찾는 중 (Gemini + Maps)</p>
        </div>
      ) : (
        <div className="animate-fade-in-up">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700">
             <h2 className="text-2xl font-bold text-white mb-2">
              <span className="text-primary">{dishName}</span> 먹으러 갈까요?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {aiMessage}
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">추천 장소</h3>
          
          <div className="space-y-4">
            {results.length > 0 ? results.map((place, idx) => (
              <a 
                key={idx} 
                href={place.uri}
                target="_blank"
                rel="noreferrer"
                className="block bg-card p-4 rounded-xl border border-gray-700 hover:border-primary transition-all hover:bg-gray-800 group"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{place.name}</h4>
                    <p className="text-gray-400 text-sm">{place.address}</p>
                    {place.rating && (
                       <span className="inline-block mt-2 text-yellow-500 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded">
                         {place.rating}
                       </span>
                    )}
                  </div>
                  <div className="bg-gray-700 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                </div>
              </a>
            )) : (
               <div className="p-8 text-center border border-dashed border-gray-700 rounded-xl text-gray-500">
                 지도에서 직접 검색된 결과가 없습니다. 지도 앱을 확인해주세요!
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapFinder;
