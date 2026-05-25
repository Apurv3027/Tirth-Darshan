export type Tirth = {
  id: string;
  name: string;
  tirthankarId: number; // FK
  location: string;
  nearestCity: string;
  state: string;
  history: string;
  mahima: string;
  howToReach: {
    road: string;
    rail: string;
    air: string;
  };
  bestTimeToVisit: string;
  hasVRDarshan: boolean;
  vrDarshanUrl?: string;
  gallery: string[];
};

export const TIRTHS: Tirth[] = [];
