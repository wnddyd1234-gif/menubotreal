
export enum WeatherCondition {
  SUNNY = 'Sunny',
  CLOUDY = 'Cloudy',
  RAINY = 'Rainy',
  SNOWY = 'Snowy',
  HOT = 'Hot',
  COLD = 'Cold',
}

export interface MealHistory {
  day1: string; // Yesterday
  day2: string; // 2 Days ago
  day3: string; // 3 Days ago
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface MenuRecommendation {
  dishName: string;
  reasoning: string;
  calories: string; // String to allow "approx 500kcal"
  tags: string[];
}

export interface RestaurantResult {
  name: string;
  address: string;
  rating?: string;
  uri?: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  apiKey?: string;
}

export enum AppStep {
  HISTORY_INPUT,
  CONTEXT_INPUT,
  ANALYZING,
  RESULTS,
  FINDING_RESTAURANTS,
  LOGIN,
  PROFILE,
}
