import React from "react";

export type LineProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<{
    className: string;
  }>;

export const Line: React.FC<React.PropsWithChildren<LineProps>> = ({
  className,
  ...restProps
}) => {
  return <div className={className} {...restProps} />;
};
