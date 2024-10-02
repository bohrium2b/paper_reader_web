// file: Fab.react.tsx
import { MdElevatedButton } from "@material/web/button/elevated-button";
import { MdFilledButton } from "@material/web/button/filled-button";
import { MdFilledTonalButton } from "@material/web/button/filled-tonal-button";
import { MdOutlinedButton } from "@material/web/button/outlined-button";
import { MdTextButton } from "@material/web/button/text-button";
import {MdFilledTonalIconButton} from "@material/web/iconbutton/filled-tonal-icon-button";
import React from "react";
import { createComponent } from "@lit/react";

export type { MdElevatedButton } from "@material/web/button/elevated-button.js";
export type { MdFilledButton } from "@material/web/button/filled-button.js";
export type { MdFilledTonalButton } from "@material/web/button/filled-tonal-button.js";
export type { MdTextButton } from "@material/web/button/text-button";


// React components for all of the buttons
export const FilledButton = createComponent({
  tagName: "md-filled-button",
  elementClass: MdFilledButton,
  react: React,
});
export const FilledTonalButton = createComponent({
  tagName: "md-filled-tonal-button",
  elementClass: MdFilledTonalButton,
  react: React,
});
export const ElevatedButton = createComponent({
  tagName: "md-elevated-button",
  elementClass: MdElevatedButton,
  react: React,
});
export const OutlinedButton = createComponent({
  tagName: "md-outlined-button",
  elementClass: MdOutlinedButton,
  react: React,
});
export const TextButton = createComponent({
  tagName: "md-text-button",
  elementClass: MdTextButton,
  react: React,
});
export const IconButton = createComponent({
  tagName: "md-filled-tonal-icon-button",
  elementClass: MdFilledTonalIconButton,
  react: React,
});

// And a generic button that switches variants

/*
 * Type: MDButtonProps:
 * -----
 * Props for the MDButton.
 * Children: the text of the button
 * variant?: what type is this button? 
 * Choose from:
 * - text, where it is just text, no fill or outline
 * - outlined, where there is an outline around it
 * - elevated, where the button has a shadow
 * - filled, where it is filled with primary1
 * - filledTonal, where it is filled with secondary
 * onclick?: a function reference for when it is clicked.
 */

type MDButtonProps = {
  children: React.ReactNode,
  variant?: "text" | "outlined" | "elevated" | "filled" | "filledTonal",
  onClick?: () => void
}

const MDButton = (props: MDButtonProps) => {

  let Variant: React.ElementType;
  switch (props.variant) {
    case "text":
      Variant = TextButton;
      break;
    case "elevated":
      Variant = ElevatedButton;
      break;
    case "filled":
      Variant = FilledButton;
      break;
    case "outlined":
      Variant = OutlinedButton;
      break;
    case "filledTonal":
      Variant = FilledTonalButton;
      break;
    default:
      Variant = FilledButton;
      break;
  }
  return (
    <Variant onClick={props.onClick}>{props.children}</Variant>
  )
};

export default MDButton;