//PACKS
import detente from "../assets/Packs/detente.webp";
import essentiel from "../assets/Packs/essentiel.webp";
import racletteromantique from "../assets/Packs/raclette-romantique.webp";
import raclettedetente from "../assets/Packs/raclette-detente.webp";
import romantiquegourmet from "../assets/Packs/romantique-gourmet.webp";

//Les plats de Bossimé
import bouletteTomate from "../assets/repasBossimé/Boulette-de-viande-sauce-tomate-1.webp";
import bouletteLiege from "../assets/repasBossimé/Boulettes-de-viande-sauce-liegeoise-1.webp";
import waterzooi from "../assets/repasBossimé/Waterzooi-de-volaille-1.webp";
import veloute from "../assets/repasBossimé/Veloute-de-carotte-et-cumin-1-150x150.webp";
import chiliVeg from "../assets/repasBossimé/Chili-vegetarien-1-150x150.webp";

//Formule découverte
import formulespa from "../assets/Découverte/formule-spa.webp";
import formuleanniversaire from "../assets/Découverte/formule-anniversaire.webp";
import passion from "../assets/Découverte/passion.webp";
import spabouteille from "../assets/Découverte/spa-bouteille.webp";
//Formule repas
import formuledejeuner from "../assets/Repas/formule-dejeuner.webp";
import formulegourmet from "../assets/Repas/formule-gourmet.webp";
import plancheapero from "../assets/Repas/planche-apero.webp";
import raclette from "../assets/Repas/raclette.webp";

//Boissons
import ambreeCondroz from "../assets/Boissons/ambreeCondroz.webp";
import blancheCondroz from "../assets/Boissons/Blanche-du-Condroz.webp";
import bruneCondroz from "../assets/Boissons/bruneCondroz.webp";
import brutBioul from "../assets/Boissons/brutBioul.webp";
import cortilBarco from "../assets/Boissons/cortilBarco.webp";
import houblondeBlonde from "../assets/Boissons/Houblonde-Blonde.webp";
import houblondeTriple from "../assets/Boissons/Houblonde-Triple.webp";
import houblondeWhite from "../assets/Boissons/Houblonde-White-IPA.webp";
import pomHappy from "../assets/Boissons/pomHappy.webp";
import ritchieCitronFramboise from "../assets/Boissons/ritchieCitronFramboise.webp";
import ritchieCola from "../assets/Boissons/ritchieCola.webp";
import ritchieColaZero from "../assets/Boissons/ritchieZero.webp";
import ritchieOrange from "../assets/Boissons/ritchieOrange.webp";
import terreCharlot from "../assets/Boissons/terreCharlot.webp";

export const extraCategories = {
  packs: {
    name: "Les packs",
    items: [
      {
        id: "packEssentiel",
        name: "L'essentiel (pour 2)",
        description:
          "Ce pack inclut un petit-déjeuner avec, accompagnements sucrés/salés, jus, café et lait ainsi qu'un accès au spa.",
        price: 85,
        extraPersonPrice: 20,
        image: essentiel,
        type: "pack",
      },
      {
        id: "packDetenteGourmet",
        name: "Le détente gourmet (pour 2)",
        description:
          "Ce pack inclut un plateau de charcuterie et fromage, une bouteille de vin, un petit-déjeuner complet avec accès au spa.",
        price: 150,
        extraPersonPrice: 40,
        image: detente,
        type: "pack",
      },
      {
        id: "packRacletteDetente",
        name: "La raclette en détente (pour 2)",
        description:
          "Ce pack inclut un assortiment de fromages à raclette et de charcuteries fines, une bouteille de vin, et un accès au spa.",
        price: 150,
        extraPersonPrice: 40,
        image: raclettedetente,
        type: "pack",
      },
      {
        id: "packRomantiqueGourmet",
        name: "Le romantique gourmet (pour 2)",
        description:
          "Ce pack inclut un plateau de charcuterie et fromage, une bouteille de crémant, un flacon d'huile de massage et un accès au spa.",
        price: 170,
        extraPersonPrice: 40,
        image: romantiquegourmet,
        type: "pack",
      },
      {
        id: "packRacletteRomantique",
        name: "La raclette romantique (pour 2)",
        description:
          'Ce pack inclut un assortiment de viandes grillées et d"accompagnements frais, une bouteille de crémant, et un accès au spa.',
        price: 170,
        extraPersonPrice: 40,
        image: racletteromantique,
        type: "pack",
      },
    ],
  },
  spa: {
    name: "Spa",
    items: [
      {
        id: "formuleSpa",
        name: "Formule SPA (2pers)",
        description: "Profitez d'un moment de détente au spa.",
        price: 50,
        extraPersonPrice: 10, // Added extra person price
        image: formulespa,
        type: "formula",
      },
      {
        id: "formuleSpaBottle",
        name: "Formule SPA + bouteille (2pers)",
        description: "Spa et bouteille de vin pour une expérience complète.",
        price: 90,
        // No extraPersonPrice for this formula
        image: spabouteille,
        type: "formula",
      },
    ],
  },
  meals: {
    name: "Les repas de Bossimé",
    items: [
      {
        id: "meatballsLiege",
        name: "Boulettes de viande sauce liégeoise",
        description:
          'Dégustez nos délicieuses boulettes de viande sauce liégeoise accompagnées d"une purée de pommes de terre maison.',
        price: 15,
        image: bouletteLiege,
        type: "meal",
      },
      {
        id: "meatballsTomato",
        name: "Boulette de viande sauce tomate",
        description:
          "Dégustez nos délicieuses boulettes de viande mijotées dans une sauce tomate maison.",
        price: 15,
        image: bouletteTomate,
        type: "meal",
      },
      {
        id: "waterzooi",
        name: "Waterzooi de volaille",
        description:
          "Savourez notre waterzooi de volaille, une spécialité originaire de la région flamande.",
        price: 15,
        image: waterzooi,
        type: "meal",
      },
      {
        id: "chiliVeg",
        name: "Chili végétarien",
        description: "Une délicieuse création végétarienne préparée avec soin.",
        price: 15,
        image: chiliVeg,
        type: "meal",
      },
      {
        id: "carrotSoup",
        name: "Velouté de carotte et cumin",
        description: "Un velouté onctueux aux carottes parfumé au cumin.",
        price: 5,
        image: veloute,
        type: "meal",
      },
    ],
  },
  formulesRepas: {
    name: "Les formules repas",
    items: [
      {
        id: "formulePetitDej",
        name: "Formule petit-déjeuner (2pers)",
        description:
          "Un petit-déjeuner copieux pour bien commencer la journée.",
        price: 35,
        extraPersonPrice: 10, // Added extra person price
        image: formuledejeuner,
        type: "formula",
      },
      {
        id: "formuleGourmet",
        name: "Formule gourmet (2pers)",
        description: "Une expérience gastronomique inoubliable.",
        price: 85,
        extraPersonPrice: 20, // Added extra person price
        image: formulegourmet,
        type: "formula",
      },
      {
        id: "formuleRaclette",
        name: "Formule raclette (2pers)",
        description: "Une raclette conviviale avec produits locaux.",
        price: 85,
        extraPersonPrice: 20, // Added extra person price
        image: raclette,
        type: "formula",
      },
      {
        id: "formulePancheApero",
        name: "Formule planche apéro (2pers)",
        description: "Une planche apéritive généreuse à partager.",
        price: 30,
        // No extraPersonPrice for this formula
        image: plancheapero,
        type: "formula",
      },
    ],
  },
  formulesDecouverte: {
    name: "Les formules découverte",
    items: [
      {
        id: "formulePassion",
        name: "Formule passion",
        description: "Une formule romantique pour les couples.",
        price: 50,
        // No extraPersonPrice for this formula
        image: passion,
        type: "formula",
      },
      {
        id: "formuleAnniversaire",
        name: "Formule anniversaire (2pers)",
        description: "Célébrez votre anniversaire avec notre formule spéciale.",
        price: 55,
        extraPersonPrice: 5, // Added extra person price
        image: formuleanniversaire,
        type: "formula",
      },
    ],
  },
  boissons: {
    name: "Les boissons",
    items: [
      // Wines
      {
        id: "brutBioul",
        name: "Brut de Bioul",
        description: "Un vin effervescent local de qualité exceptionnelle.",
        price: 50,
        image: brutBioul,
        type: "bulles",
      },
      {
        id: "cortilBarco",
        name: "Cortil Barco",
        description: "Un vin rouge élégant aux notes fruitées.",
        price: 30,
        image: cortilBarco,
        type: "wine",
      },
      {
        id: "terreCharlot",
        name: "Terre Charlot",
        description: "Un vin blanc raffiné aux arômes subtils.",
        price: 30,
        image: terreCharlot,
        type: "wine",
      },
      // Beers
      {
        id: "houblondeTriple",
        name: "Houblonde Triple",
        description: "Une bière triple traditionnelle belge.",
        price: 4,
        image: houblondeTriple,
        type: "beer",
      },
      {
        id: "houblondeBlonde",
        name: "Houblonde Blonde",
        description: "Une bière blonde rafraîchissante.",
        price: 4,
        image: houblondeBlonde,
        type: "beer",
      },
      {
        id: "houblondeWhite",
        name: "Houblonde White IPA",
        description: "Une IPA blanche aux notes agrumes.",
        price: 4,
        image: houblondeWhite,
        type: "beer",
      },
      {
        id: "bruneCondroz",
        name: "Brune du Condroz",
        description: "Une bière brune locale du Condroz.",
        price: 4,
        image: bruneCondroz,
        type: "beer",
      },
      {
        id: "ambreeCondroz",
        name: "Ambrée du Condroz",
        description: "Une bière ambrée aux malts caramélisés.",
        price: 4,
        image: ambreeCondroz,
        type: "beer",
      },
      {
        id: "blancheCondroz",
        name: "Blanche du Condroz",
        description: "Une bière blanche légère et rafraîchissante.",
        price: 4,
        image: blancheCondroz,
        type: "beer",
      },
      // Softs
      {
        id: "appleJuice",
        name: 'Jus de pomme « Pom d"Happy »',
        description: "Un jus de pomme naturel et rafraîchissant.",
        price: 3,
        image: pomHappy,
        type: "soft",
      },
      {
        id: "ritchieLemonRasp",
        name: "Ritchie Citron/Framboise",
        description:
          "Une boisson pétillante aux saveurs de citron et framboise.",
        price: 3,
        image: ritchieCitronFramboise,
        type: "soft",
      },
      {
        id: "ritchieOrangeVan",
        name: "Ritchie Orange/Vanille",
        description: "Un mélange rafraîchissant d'orange et de vanille.",
        price: 3,
        image: ritchieOrange,
        type: "soft",
      },
      {
        id: "ritchieCola",
        name: "Ritchie Cola",
        description: "Un cola artisanal unique.",
        price: 3,
        image: ritchieCola,
        type: "soft",
      },
      {
        id: "ritchieColaZero",
        name: "Ritchie Cola Zéro",
        description: "La version sans sucre du cola artisanal.",
        price: 3,
        image: ritchieColaZero,
        type: "soft",
      },
    ],
  },
};

// Helper functions remain the same
export const getExtraById = (id) => {
  for (const category of Object.values(extraCategories)) {
    const item = category.items.find((item) => item.id === id);
    if (item) return item;
  }
  return null;
};

export const calculateExtrasTotal = (selectedExtras) => {
  return Object.entries(selectedExtras).reduce((total, [extraId, quantity]) => {
    const extra = getExtraById(extraId);
    return total + (extra?.price || 0) * quantity;
  }, 0);
};
