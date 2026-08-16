export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Matcha" | "Hojicha";
  popular?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    description: "Smooth ceremonial matcha with steamed milk",
    price: 180,
    category: "Matcha",
  },
  {
    id: "seasalt-cream-matcha",
    name: "Seasalt Cream Matcha Latte",
    description: "Matcha latte topped with salted cream foam",
    price: 180,
    category: "Matcha",
    popular: true,
  },
  {
    id: "earl-grey-matcha",
    name: "Earl Grey Matcha Latte",
    description: "Floral earl grey blended with ceremonial matcha",
    price: 180,
    category: "Matcha",
    popular: true,
  },
  {
    id: "toasted-milk-cereal-matcha",
    name: "Toasted Milk Cereal Matcha Latte",
    description: "Matcha latte with toasted milk cereal flavor",
    price: 180,
    category: "Matcha",
    popular: true,
  },
  {
    id: "tokyo-fog",
    name: "Tokyo Fog",
    description: "Earl grey vanilla latte with a matcha swirl",
    price: 180,
    category: "Matcha",
  },
  {
    id: "egg-cream-matcha",
    name: "Egg Cream Matcha",
    description: "Silky matcha with a creamy egg foam topping",
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
    description: "Roasted green tea with warm steamed milk",
    price: 180,
    category: "Hojicha",
  },
  {
    id: "seasalt-cream-hojicha",
    name: "Seasalt Cream Hojicha",
    description: "Hojicha latte topped with salted cream foam",
    price: 180,
    category: "Hojicha",
    popular: true,
  },
];
