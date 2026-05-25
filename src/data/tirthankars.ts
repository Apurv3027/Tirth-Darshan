export type Tirthankar = {
  id: number;
  name: string;
  nameGujarati: string;
  symbol: string;
  symbolEmoji: string;
  color: string;
  colorHex: string;
  height: string;
  lifespan: string;
  yaksha: string;
  yakshini: string;
  birthPlace: string;
  nirvanaPlace: string;
  dikshaPlace: string;
  kevalgyanPlace: string;
  teachings: string[];
  significance: string;
  famousTirths: string[];
  panchKalyanak: {
    garbha: string;
    janma: string;
    diksha: string;
    kevalgyan: string;
    nirvana: string;
  };
};

export const TIRTHANKARS: Tirthankar[] = [];
