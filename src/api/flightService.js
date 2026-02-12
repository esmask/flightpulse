import axios from "axios";

const API_URL = "http://localhost:5000";

export async function searchAirports(query) {
  try {
    const res = await axios.get(`${API_URL}/airports?search=${query}`);
    return res.data;
  } catch (err) {
    console.error(err); // Ovo rešava crvenu liniju
    return [];
  }
}

export async function getLiveFlights() {
  try {
    const res = await axios.get(`${API_URL}/live-flights`);
    return res.data.states || [];
  } catch (err) {
    console.error(err); // Ovo rešava crvenu liniju
    return [];
  }
}