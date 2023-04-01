import React from "react";

export type FloatingButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  Partial<{
    className: string;
  }>;

export const FloatingButton: React.FC<
  React.PropsWithChildren<FloatingButtonProps>
> = ({ children, className, ...restProps }) => {
  return (
    <button className={`${className}`} {...restProps}>
      {children}
    </button>
  );
};
