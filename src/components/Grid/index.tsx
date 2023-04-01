import React from "react";

export type GridProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<{
    className: string;
  }>;

export const Grid: React.FC<React.PropsWithChildren<GridProps>> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
};
