import clsx from "clsx";
import { ComponentProps, MouseEventHandler } from "react";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
} & Omit<ComponentProps<IconType>, "onClick">;

export const CircleIcon = ({
  icon: Children,
  className,
  onClick,
  ...iconProps
}: Props) => {
  return (
    <div
      className={clsx(
        "cursor-pointer rounded-full bg-gray-700/50 p-2 text-white transition-opacity hover:opacity-75",
        className
      )}
      onClick={onClick}
    >
      <Children {...iconProps} />
    </div>
  );
};
