import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = 'https://places.googleapis.com/v1/places:searchNearby';
const API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;
console.log(API_KEY);
const config = {
    headers:{
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': ['places.displayName',
        'places.formattedAddress',
        'places.shortFormattedAddress', 
        'places.location', 
        'places.photos']
    }
}
console.log(config);
const NewNearbyPlace = (data) => axios.post(BASE_URL,data,config);

export default { NewNearbyPlace, API_KEY };