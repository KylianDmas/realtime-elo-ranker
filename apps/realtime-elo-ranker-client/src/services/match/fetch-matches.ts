import { Match } from "../ranking/models/match";

export default function fetchMatches(baseUrl: string): Promise<any[]> {
  return fetch(baseUrl + "/api/matches", { method: "GET" })
    .then(res => res.ok ? res.json() : []);
}