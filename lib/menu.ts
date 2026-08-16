export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Matcha" | "Hojicha";
};

export const menuItems: MenuItem[] = [
  {
    id: "seasalt-cream-matcha",
    name: "Seasalt Cream Matcha Latte",
    description: "Creamy matcha topped with sweet and lightly salty cream.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "earl-grey-matcha",
    name: "Earl Grey Matcha Latte",
    description: "Matcha blended with fragrant Earl Grey tea and creamy milk.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "toasted-milk-cereal-matcha",
    name: "Toasted Milk Cereal Matcha Latte",
    description: "Matcha with sweet, creamy toasted cereal milk.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "tokyo-fog",
    name: "Tokyo Fog",
    description: "A matcha twist on the classic London Fog with Earl Grey, matcha, and milk.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "matcha-cloud-coconut",
    name: "Matcha Cloud Coconut",
    description: "Smooth matcha poured over refreshing coconut juice. Light, tropical, and naturally sweet.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    description: "Smooth matcha blended with creamy milk.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "iced-americano-matcha",
    name: "Iced Americano Matcha",
    description: "Matcha mixed with cold water and served over ice for a refreshing, lighter drink.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "seasalt-cream-hojicha",
    name: "Seasalt Cream Hojicha",
    description: "Roasted hojicha topped with sweet and lightly salty cream.",
    price: 180,
    category: "Hojicha",
  },
  {
    id: "hojicha-latte",
    name: "Hojicha Latte",
    description: "Smooth roasted hojicha blended with creamy milk.",
    price: 180,
    category: "Hojicha",
  },
];
