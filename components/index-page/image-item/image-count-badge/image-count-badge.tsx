import { RiImageLine } from "react-icons/ri";

export const ImageCountBadge = ({ count }: { count: number }) => (
  <div className="flex items-center rounded bg-white/50 px-1">
    <RiImageLine />
    <span className="ml-1 text-sm">{count}</span>
  </div>
);
