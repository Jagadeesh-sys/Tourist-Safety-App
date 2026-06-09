import { apiClient } from '../api/apiClient';

// Fallback data for attractions
const fallbackAttractions = [
  { id: 1, name: 'Taj Mahal', city: 'Agra', rating: 4.9, reviews: 5000, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600' },
  { id: 2, name: 'Red Fort', city: 'Delhi', rating: 4.7, reviews: 3200, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
  { id: 3, name: 'Gateway of India', city: 'Mumbai', rating: 4.6, reviews: 2800, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600' },
  { id: 4, name: 'Hawa Mahal', city: 'Jaipur', rating: 4.8, reviews: 3500, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600' },
  { id: 5, name: 'Ghats of Varanasi', city: 'Varanasi', rating: 4.9, reviews: 2200, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },
  { id: 6, name: 'Amer Fort', city: 'Jaipur', rating: 4.8, reviews: 2900, image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600' },
  { id: 7, name: 'Qutub Minar', city: 'Delhi', rating: 4.6, reviews: 2400, image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600' },
  { id: 8, name: 'Colva Beach', city: 'Goa', rating: 4.7, reviews: 1800, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600' },
  { id: 9, name: 'Charminar', city: 'Hyderabad', rating: 4.7, reviews: 2100, image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600' },
  { id: 10, name: 'Backwaters', city: 'Kerala', rating: 4.9, reviews: 3000, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600' },
  { id: 11, name: 'Solang Valley', city: 'Manali', rating: 4.8, reviews: 1500, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600' },
  { id: 12, name: 'Victoria Memorial', city: 'Kolkata', rating: 4.6, reviews: 1600, image: 'https://images.unsplash.com/photo-1597074773835-91385f250b94?w=600' },
];

const fallbackHotels = [
  { id: 1, name: 'The Oberoi', city: 'Delhi', rating: 4.9, price: 250, type: 'Luxury', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
  { id: 2, name: 'Taj Lake Palace', city: 'Udaipur', rating: 4.9, price: 300, type: 'Luxury', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
  { id: 3, name: 'ITC Grand Chola', city: 'Chennai', rating: 4.8, price: 200, type: 'Luxury', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
  { id: 4, name: 'Hotel Marine Plaza', city: 'Mumbai', rating: 4.7, price: 150, type: 'Premium', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
  { id: 5, name: 'The Leela Goa', city: 'Goa', rating: 4.8, price: 180, type: 'Beach Resort', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' },
  { id: 6, name: 'Rambagh Palace', city: 'Jaipur', rating: 4.9, price: 280, type: 'Heritage', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600' },
  { id: 7, name: 'Trident Hyderabad', city: 'Hyderabad', rating: 4.6, price: 130, type: 'Premium', image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=600' },
  { id: 8, name: 'Ganges View', city: 'Varanasi', rating: 4.7, price: 90, type: 'Boutique', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600' },
];

const fallbackRestaurants = [
  { id: 1, name: 'Indian Accent', city: 'Delhi', rating: 4.8, cuisine: 'Modern Indian', price: 40, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600' },
  { id: 2, name: 'Dum Pukht', city: 'Delhi', rating: 4.7, cuisine: 'Awadhi', price: 35, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
  { id: 3, name: 'Britto\'s', city: 'Goa', rating: 4.5, cuisine: 'Seafood', price: 25, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600' },
  { id: 4, name: 'Karim\'s', city: 'Delhi', rating: 4.6, cuisine: 'Mughlai', price: 15, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' },
  { id: 5, name: 'The Table', city: 'Mumbai', rating: 4.7, cuisine: 'Global', price: 45, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600' },
  { id: 6, name: 'Cinnamon', city: 'Jaipur', rating: 4.6, cuisine: 'Rajasthani', price: 20, image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600' },
  { id: 7, name: 'Blue Fox', city: 'Hyderabad', rating: 4.5, cuisine: 'Andhra', price: 18, image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600' },
  { id: 8, name: 'Kashi Chat Bhandar', city: 'Varanasi', rating: 4.8, cuisine: 'Street Food', price: 5, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600' },
  { id: 9, name: 'Ziya', city: 'Mumbai', rating: 4.9, cuisine: 'European', price: 60, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600' },
  { id: 10, name: '1135 AD', city: 'Jaipur', rating: 4.7, cuisine: 'Indian Fusion', price: 30, image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600' },
];

export const travelService = {
  getAttractions: async () => {
    try {
      const { data } = await apiClient.get('/travel/attractions');
      return data && data.length > 0 ? data : fallbackAttractions;
    } catch {
      return fallbackAttractions;
    }
  },
  getHotels: async () => {
    try {
      const { data } = await apiClient.get('/travel/hotels');
      return data && data.length > 0 ? data : fallbackHotels;
    } catch {
      return fallbackHotels;
    }
  },
  getRestaurants: async () => {
    try {
      const { data } = await apiClient.get('/travel/restaurants');
      return data && data.length > 0 ? data : fallbackRestaurants;
    } catch {
      return fallbackRestaurants;
    }
  },
  getRouteRecommendation: async () => {
    const { data } = await apiClient.get('/travel/routes/recommendation');
    return data;
  },
  chatAI: async (message) => {
    const { data } = await apiClient.post('/travel/ai/chat', { message });
    return data;
  },
};
