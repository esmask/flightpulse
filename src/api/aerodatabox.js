import axios from "axios";

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = "aerodatabox.p.rapidapi.com";

export async function getAirportFlights(iata) {
  const url = `https://${API_HOST}/flights/airports/iata/${iata}`;

  const params = {
    offsetMinutes: "-120",
    durationMinutes: "720",
    withLeg: "true",
    direction: "Both",
    withCancelled: "true",
    withCodeshared: "true",
    withCargo: "true",
    withPrivate: "true",
    withLocation: "false",
  };

  const headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  };

  try {
    const res = await axios.get(url, { params, headers });
    return res.data;
  } catch (err) {
    console.error("Airport flights error:", err);
    return null;
  }
}
