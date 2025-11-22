import React from "react";
import Button, { type ButtonProps } from "./Button";
import { cn } from "@/lib/utils";
import { setAttr } from '@directus/visual-editing';

export interface ButtonGroupProps {
  data: {
    id: string;
    buttons?: Array<ButtonProps>;
  };
  className?: string;
}

const ButtonGroup = ({ data, className }: ButtonGroupProps) => {
  const { id, buttons = [] } = data;
  
  if (!buttons || !buttons.length) return null;

  const containerClasses = cn("flex flex-wrap gap-4 justify-center", className);

  return (
    <div 
      className={containerClasses}
      data-directus={setAttr({
        collection: 'block_button_group',
        item: id,
        fields: 'buttons',
        mode: 'modal',
      })}
    >
      {buttons.map((button) => (
        <Button key={button.id} {...button} />
      ))}
    </div>
  );
};

export default ButtonGroup;
