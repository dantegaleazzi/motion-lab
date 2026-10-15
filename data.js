import { stedCards } from "./sted-data.js";
const entry = (id, title, category) => ({
  src: `./assets/${id}.jpg`,
  title,
  category,
});
export const collections = {
  sted: stedCards.map((item) => ({ ...item, hub: "./assets/sted/mascot.svg" })),
  travel: [
    entry("alpine", "A little further away", "Alpine"),
    entry("lake", "Take the slow way", "Lakeside"),
    entry("ocean", "Meet me at the coast", "Ocean"),
    entry("forest", "Find a quieter place", "Forest"),
  ],
  objects: [
    entry("coffee", "The morning ritual", "Coffee"),
    entry("camera", "A different perspective", "Photography"),
    entry("chair", "Room for good design", "Design"),
    entry("sound", "Stay for one more song", "Sound"),
  ],
  editorial: [
    entry("architecture", "Between light & shadow", "Architecture"),
    entry("plant", "Good things take time", "Botanical"),
    entry("books", "An idea worth keeping", "Reading"),
    entry("interior", "A place to begin", "Interiors"),
  ],
};
