export enum RankingEventType {
  RankingUpdate = "RankingUpdate",
  MatchUpdate = "MatchUpdate",
  ResetUpdate = "ResetUpdate"
}

export type RankingEvent = 
  | { type: RankingEventType.RankingUpdate; player: { id: string; rank: number } }
  | { type: RankingEventType.MatchUpdate; match: any }
  | { type: RankingEventType.ResetUpdate }
  | ({ type: "Error" } & Error);