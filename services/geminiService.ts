
import { GoogleGenAI, Type } from "@google/genai";
import { MealHistory, WeatherCondition, LocationData, MenuRecommendation, RestaurantResult } from "../types";

// Helper to initialize client with dynamic or env key
const getAiClient = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    console.warn("No API Key provided. Calls may fail.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const analyzeMenuPreferences = async (
  history: MealHistory,
  weather: WeatherCondition,
  location: LocationData,
  apiKey?: string
): Promise<MenuRecommendation[]> => {
  const ai = getAiClient(apiKey);
  const model = "gemini-2.5-flash";

  // Using Korean Prompt
  const prompt = `
    당신은 세계적인 영양사이자 미식가 셰프입니다.
    
    사용자 컨텍스트:
    - 최근 3일간 점심 식사 기록: 3일 전(${history.day3}), 2일 전(${history.day2}), 어제(${history.day1}).
    - 현재 날씨: ${weather}.
    - 위치 (위도/경도): ${location.latitude}, ${location.longitude} (가능하다면 해당 지역의 문화적/지리적 특성을 고려하세요).
    
    임무:
    과거 식사의 영양 균형과 식감, 종류를 분석하세요.
    오늘 점심으로 적절한, 서로 다른 스타일의 메뉴 3가지를 추천해주세요. 날씨와 이전 식사 기록을 고려해야 합니다.
    
    1. 옵션 1: 이전 식사를 고려했을 때 속이 편안하거나 영양 균형을 맞추는 메뉴.
    2. 옵션 2: 조금 더 가볍거나 건강한 대안.
    3. 옵션 3: 약간의 모험이나 자극이 되는 선택 (매운맛, 특이한 별미 등).

    출력 요구사항:
    반드시 아래 스키마에 맞는 JSON 형식만 반환하세요.
    언어는 한국어로 출력하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dishName: { type: Type.STRING, description: "음식 이름 (예: 김치찌개)" },
              reasoning: { type: Type.STRING, description: "이 메뉴를 추천하는 이유 (날씨 및 기록 기반)" },
              calories: { type: Type.STRING, description: "대략적인 칼로리 (예: '약 500kcal')" },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "3개의 짧은 태그 (예: ['얼큰함', '단백질', '해장'])"
              }
            },
            required: ["dishName", "reasoning", "calories", "tags"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MenuRecommendation[];
    }
    throw new Error("No text returned from Gemini");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback safe data if AI fails
    return [
      { dishName: "비빔밥", reasoning: "야채와 탄수화물의 균형이 좋은 메뉴입니다.", calories: "500 kcal", tags: ["건강", "한식", "채소"] },
      { dishName: "닭가슴살 샐러드", reasoning: "가볍게 즐길 수 있는 건강식입니다.", calories: "350 kcal", tags: ["다이어트", "저탄수", "신선"] },
      { dishName: "우동", reasoning: "따뜻한 국물이 날씨와 잘 어울립니다.", calories: "450 kcal", tags: ["따뜻함", "일식", "국물"] }
    ];
  }
};

export const findRestaurantsForDish = async (
  dishName: string,
  location: LocationData,
  apiKey?: string
): Promise<{ text: string; places: RestaurantResult[] }> => {
  const ai = getAiClient(apiKey);
  const model = "gemini-2.5-flash"; // Supports search/maps tools
  
  const prompt = `내 현재 위치 근처에서 "${dishName}" 맛집을 찾아주세요. 평점이 높고 인기 있는 곳 위주로 추천해주세요.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      }
    });

    const text = response.text || "주변 음식점 정보를 불러왔습니다.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract map data from grounding chunks
    const places: RestaurantResult[] = [];
    
    chunks.forEach((chunk) => {
      if (chunk.web?.uri && chunk.web?.title) {
           places.push({
            name: chunk.web.title,
            address: "링크에서 확인하세요",
            uri: chunk.web.uri
          });
      }
      const mapData = (chunk as any).maps; 
      if (mapData) {
         places.push({
           name: mapData.title || "알 수 없는 장소",
           address: mapData.address || "주소 정보 없음",
           rating: mapData.rating ? `★ ${mapData.rating}` : undefined,
           uri: mapData.placeId ? `https://www.google.com/maps/place/?q=place_id:${mapData.placeId}` : undefined
         });
      }
    });

    return { text, places };

  } catch (error) {
    console.error("Gemini Maps Error:", error);
    return { 
      text: "현재 지도 정보를 불러올 수 없지만, 지도 앱에서 '" + dishName + "'을(를) 검색해보세요!", 
      places: [] 
    };
  }
};
