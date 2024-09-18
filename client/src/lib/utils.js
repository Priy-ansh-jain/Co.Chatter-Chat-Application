import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "../assets/loaderAnimation.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#DAA520] text-[#41423a] border-[1px] border[#ff006faa]",
  "bg-[#ffd60a2b] text-[#FF98E2]  border-[ffd60abb]",
  "bg-[#4cc9a099] text-[#06d6a0] border-[#06d6a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[px] border-[#4cc9f0bb]",
  "bg-[#F3B9D2] text-[#41423a] border-[1px] border[#41423A]",
  "bg-[#858DFF] text-[#774178] border-[ffd60abb]",
  "bg-[#4cc9d99] text-[#DAE6E4] border-[#06d6a0bb] border-[1px]",
  "bg-[#4cc9f089] text-[#4cc9f0] border-[px] border-[#4cc9f0bb]",
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Correctly access the first element of the array
};

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
};
