import React from "react";

export type StackProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<{
    className: string;
  }>;

export const Stack: React.FC<React.PropsWithChildren<StackProps>> = ({
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
