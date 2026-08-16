export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Hot" | "Iced" | "Blended";
  popular?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: "classic-matcha-hot",
    name: "Classic Matcha Latte",
    description: "Ceremonial grade matcha with steamed milk",
    price: 180,
    category: "Hot",
    popular: true,
  },
  {
    id: "iced-matcha",
    name: "Iced Matcha Latte",
    description: "Smooth matcha over ice with cold milk",
    price: 200,
    category: "Iced",
    popular: true,
  },
  {
    id: "dirty-matcha",
    name: "Dirty Matcha",
    description: "Double espresso shot layered with matcha",
    price: 230,
    category: "Iced",
  },
  {
    id: "strawberry-matcha",
    name: "Strawberry Matcha",
    description: "Fresh strawberry milk with a matcha swirl",
    price: 240,
    category: "Iced",
    popular: true,
  },
  {
    id: "brown-sugar-matcha",
    name: "Brown Sugar Matcha",
    description: "Rich brown sugar syrup swirled into matcha",
    price: 230,
    category: "Iced",
  },
  {
    id: "hojicha-hot",
    name: "Hojicha Latte",
    description: "Roasted green tea, warm and nutty",
    price: 200,
    category: "Hot",
  },
  {
    id: "oat-matcha",
    name: "Oat Milk Matcha",
    description: "Ceremonial matcha with creamy oat milk",
    price: 230,
    category: "Hot",
  },
  {
    id: "matcha-shake",
    name: "Matcha Shake",
    description: "Thick blended matcha with vanilla ice cream",
    price: 260,
    category: "Blended",
    popular: true,
  },
  {
    id: "hojicha-shake",
    name: "Hojicha Shake",
    description: "Blended hojicha with milk and ice",
    price: 250,
    category: "Blended",
  },
  {
    id: "matcha-smoothie",
    name: "Matcha Smoothie",
    description: "Matcha blended with banana and coconut milk",
    price: 260,
    category: "Blended",
  },
];
