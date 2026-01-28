"use client";

import {
  MatchForm,
  MatchResult,
  PlayerData,
  PlayerForm,
  RankingLadder,
} from "@realtime-elo-ranker/libs/ui";
import { Poppins } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import fetchRanking from "../services/ranking/fetch-ranking";
import subscribeRankingEvents from "../services/ranking/subscribe-ranking-events";
import { RankingEventType } from "../services/ranking/models/ranking-event";
import { motion } from "motion/react";
import postMatchResult from "../services/match/post-match-result";
import postPlayer from "../services/player/post-player";
import fetchMatches from "../services/match/fetch-matches";
import { Match } from "../services/ranking/models/match";

const poppinsBold = Poppins({
  weight: "600",
  style: "normal",
  variable: "--poppins-bold",
});

const poppinsSemiBold = Poppins({
  weight: "500",
  style: "normal",
  variable: "--poppins-semi-bold",
});

function quickSortPlayers(arr: PlayerData[]): PlayerData[] {
  if (arr.length <= 1) return arr;
  const p = arr.pop()!;
  const left = [];
  const right = [];
  for (const el of arr) {
    if (el.rank >= p.rank) left.push(el);
    else right.push(el);
  }
  return [...quickSortPlayers(left), p, ...quickSortPlayers(right)];
}

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");

  const [ladderData, setLadderData] = useState<PlayerData[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const updateLadderData = useCallback((player: { id: string; rank: number }) => {
    setLadderData((prevData) => {
      const existingPlayer = prevData.find((p) => p.id === player.id);
      const updatedPlayer: PlayerData = existingPlayer 
        ? { ...existingPlayer, rank: player.rank } 
        : { id: player.id, rank: player.rank };

      return quickSortPlayers(
        prevData.filter((p) => p.id !== player.id).concat(updatedPlayer)
      );
    });
  }, []);

  const handleReset = async () => {
    if (confirm("Voulez-vous vraiment tout effacer ?")) {
      await fetch(`${API_BASE_URL}/api/reset`, { method: "POST" });
    }
  };

  useEffect(() => {
    fetchRanking(API_BASE_URL).then(setLadderData);
    fetchMatches(API_BASE_URL).then((data) => setMatches(data.reverse()));

    const eventSource = subscribeRankingEvents(API_BASE_URL);

    eventSource.onmessage = (msg: MessageEvent) => {
      const event = JSON.parse(msg.data);
      
      if (event.type === RankingEventType.RankingUpdate) {
        updateLadderData(event.player);
      } else if (event.type === RankingEventType.MatchUpdate) {
        setMatches((prev) => [event.match, ...prev]);
      } 
      else if (event.type === RankingEventType.ResetUpdate) {
        setLadderData([]);
        setMatches([]);
      }
    };

    return () => eventSource.close();
  }, [API_BASE_URL, updateLadderData]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <motion.main 
        className="flex-1 px-12 pt-20 pb-12 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className={`${poppinsBold.className} text-4xl font-bold mb-10`}>
          Realtime Elo Ranker
        </h1>
        <button 
            onClick={handleReset}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
        >
            Réinitialiser la BD
        </button>

        <div className="w-full mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className={`${poppinsSemiBold.className} text-2xl mb-6`}>
            Classement des joueurs
          </h2>
          <RankingLadder data={ladderData} />
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[300px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className={`${poppinsSemiBold.className} text-xl mb-4`}>Déclarer un match</h2>
            <MatchForm
                callback={async (adversaryA, adversaryB, result) => {
                  try {
                    const response = await postMatchResult(API_BASE_URL, adversaryA, adversaryB, result);                    
                    if (!response.ok) {
                      const clonedResponse = response.clone();
                      const errorData = await clonedResponse.json();
                      alert(`Erreur : ${errorData.message}`);
                    }
                    return response;                     
                  } catch (error) {
                    console.error("Erreur réseau :", error);
                    alert("Le serveur ne répond pas.");
                    throw error; 
                  }
                }}
              />
          </div>
          <div className="flex-1 min-w-[300px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className={`${poppinsSemiBold.className} text-xl mb-4`}>Ajouter un joueur</h2>
            <PlayerForm
              callback={(playerName) => postPlayer(API_BASE_URL, playerName)}
            />
          </div>
        </div>
      </motion.main>

      <aside className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <h2 className={`${poppinsSemiBold.className} text-xl`}>Derniers Matchs</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {matches.map((m) => (
            <div key={m.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm">
              <div className="flex justify-between items-center font-semibold mb-2">
                <span className="text-blue-600">{m.winnerId}</span>
                <span className="text-gray-400 font-normal">vs</span>
                <span className="text-red-500">{m.loserId}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                 <span>{m.isDraw ? "Égalité" : "Victoire"}</span>
                 <span>{new Date(m.date).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {matches.length === 0 && (
            <p className="text-center text-gray-400 mt-10 text-sm italic">Aucun match enregistré</p>
          )}
        </div>
      </aside>
    </div>
  );
}