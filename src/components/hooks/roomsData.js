import tinyHouse from "../../assets/Chambres/tiny-house-1.jpg";
import tinyHouse2 from "../../assets/Chambres/tiny-house-2.jpg";
import tinyHouse3 from "../../assets/Chambres/tinySnow.jpg";

export const roomsData = {
  2428698: {
    id: 2428698,
    name: "La porte du Chalet",
    description: "Un dôme luxueux avec vue panoramique sur la nature",
    image: tinyHouse, // Store images locally
    maxGuests: 4,
    features: ["Vue panoramique", "Jacuzzi privé", "Cuisine équipée", "Vue panoramique", "Jacuzzi privé"],
    amenities: ["WiFi", "TV", "Climatisation", "Parking"],
    size: "40m²",
  },
  2428703: {
    id: 2428703,
    name: "La canne à sucre",
    description: "Parfait pour observer les étoiles",
    image: tinyHouse2,
    maxGuests: 2,
    features: ["Toit transparent", "Terrasse privée"],
    amenities: ["WiFi", "Mini-bar", "Chauffage"],
    size: "30m²",
  },
  2432648: {
    id: 2432648,
    name: "La suite du Bar",
    description: "Parfait pour observer les étoiles",
    image: tinyHouse3,
    maxGuests: 2,
    features: ["Toit transparent", "Terrasse privée"],
    amenities: ["WiFi", "Mini-bar", "Chauffage"],
    size: "40m²",
  },
};