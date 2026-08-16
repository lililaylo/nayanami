export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Matcha" | "Hojicha";
};

export const menuItems: MenuItem[] = [
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    description: "Smooth ceremonial matcha with milk over ice",
    price: 180,
    category: "Matcha",
  },
  {
    id: "seasalt-cream-matcha",
    name: "Seasalt Cream Matcha Latte",
    description: "Iced matcha latte topped with salted cream foam",
    price: 180,
    category: "Matcha",
  },
  {
    id: "earl-grey-matcha",
    name: "Earl Grey Matcha Latte",
    description: "Floral earl grey blended with ceremonial matcha over ice",
    price: 180,
    category: "Matcha",
  },
  {
    id: "toasted-milk-cereal-matcha",
    name: "Toasted Milk Cereal Matcha Latte",
    description: "Iced matcha with a toasted milk cereal finish",
    price: 180,
    category: "Matcha",
  },
  {
    id: "tokyo-fog",
    name: "Tokyo Fog",
    description: "Earl grey vanilla latte with a matcha swirl over ice",
    price: 180,
    category: "Matcha",
  },
  {
    id: "egg-cream-matcha",
    name: "Egg Cream Matcha",
    description: "Iced matcha with a silky egg cream topping",
    price: 180,
    category: "Matcha",
  },
  {
    id: "iced-matcha-americano",
    name: "Iced Matcha Americano",
    description: "Espresso shots over iced matcha for a bold kick",
    price: 180,
    category: "Matcha",
  },
  {
    id: "hojicha-latte",
    name: "Hojicha Latte",
    description: "Roasted green tea with milk over ice",
    price: 180,
    category: "Hojicha",
  },
  {
    id: "seasalt-cream-hojicha",
    name: "Seasalt Cream Hojicha",
    description: "Iced hojicha latte topped with salted cream foam",
    price: 180,
    category: "Hojicha",
  },
];
