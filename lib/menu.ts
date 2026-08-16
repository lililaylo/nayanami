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
    description: "Ceremonial grade matcha whisked smooth, poured over ice with fresh cold milk. Clean, grassy, and subtly sweet.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "seasalt-cream-matcha",
    name: "Seasalt Cream Matcha Latte",
    description: "Iced matcha latte crowned with a thick salted cream foam. Each sip layers earthy matcha with a savory-sweet cream finish.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "earl-grey-matcha",
    name: "Earl Grey Matcha Latte",
    description: "Bergamot-forward earl grey meets ceremonial matcha over ice. Floral, citrusy, and earthy all at once.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "toasted-milk-cereal-matcha",
    name: "Toasted Milk Cereal Matcha Latte",
    description: "Iced matcha with toasted cereal-infused milk — warm, nutty, and nostalgic. Like your favorite breakfast in a cup.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "tokyo-fog",
    name: "Tokyo Fog",
    description: "A Japanese spin on the London Fog — earl grey, vanilla, and milk over ice with a swirl of matcha. Soft, fragrant, and creamy.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "egg-cream-matcha",
    name: "Egg Cream Matcha",
    description: "Iced matcha topped with a silky, velvety egg white cream. Light and airy on top, bold matcha underneath.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "iced-matcha-americano",
    name: "Iced Matcha Americano",
    description: "Double espresso poured over iced ceremonial matcha. Rich, bold, and energizing — for those who want it strong.",
    price: 180,
    category: "Matcha",
  },
  {
    id: "hojicha-latte",
    name: "Hojicha Latte",
    description: "Roasted Japanese green tea over ice with cold milk. Warm, toasty, and naturally low in caffeine — smooth with a subtle caramel note.",
    price: 180,
    category: "Hojicha",
  },
  {
    id: "seasalt-cream-hojicha",
    name: "Seasalt Cream Hojicha",
    description: "Iced hojicha latte with a thick salted cream foam on top. The roasty, nutty base pairs perfectly with the savory cream.",
    price: 180,
    category: "Hojicha",
  },
];
