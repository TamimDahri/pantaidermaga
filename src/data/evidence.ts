export interface Evidence {
  id: string;
  title: string;
  year: number;
  location: string;
  image: string;
  description: string;
  source: string;
  reference: string;
  type: "map" | "photo" | "document" | "newspaper";
}

export const evidences: Evidence[] = [
  {
    id: "map-1875",
    title: "Peta Linggi, Lukut & Sungai Ujong",
    year: 1875,
    location: "Tanjung Kemuning",
    image: "/maps/1875-map.jpg",
    description:
      "Nama Tanjung Kemuning direkodkan sebelum penamaan Port Dickson.",
    source: "Arkib Negara Malaysia",
    reference: "N56/NX12",
    type: "map",
  },

  {
    id: "map-1876",
    title: "Peta J. Murray",
    year: 1876,
    location: "Lukut",
    image: "/maps/1876-murray.jpg",
    description:
      "Lukut direkodkan sebagai pusat penting di kawasan ini.",
    source: "Royal Geographical Society",
    reference: "1876",
    type: "map",
  },
];