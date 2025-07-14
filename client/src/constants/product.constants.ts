export const genders = ["Male", "Female", "Kids"] as const;
export const categories = [
  "Fashion",
  "Electronics",
  "Hand Bag",
  "Shoes",
  "Wallet",
  "Sunglass",
  "Cap",
] as const;
export const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;
export const colors = [
  { name: "Navy", color: "#0F172A", class: "bg-[#0F172A]" },
  { name: "Yellow", color: "#FCD34D", class: "bg-[#FCD34D]" },
  { name: "White", color: "#FFFFFF", class: "bg-white border" },
  { name: "Orange", color: "#FB923C", class: "bg-[#FB923C]" },
  { name: "Green", color: "#22C55E", class: "bg-[#22C55E]" },
  { name: "Pink", color: "#EC4899", class: "bg-[#EC4899]" },
  { name: "Cyan", color: "#06B6D4", class: "bg-[#06B6D4]" },
  { name: "Blue", color: "#3B82F6", class: "bg-[#3B82F6]" },
] as const;

export const colorNames = [
  "Navy",
  "Yellow",
  "White",
  "Orange",
  "Green",
  "Pink",
  "Cyan",
  "Blue",
] as const;

export const brands = [
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Under Armour",
] as const;
