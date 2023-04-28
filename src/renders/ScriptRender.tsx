import { FC } from "react";
import { ScriptProps } from "../types";
import { createPortal } from "react-dom";

interface IScriptRenderProps {
  tags: ScriptProps[],
}

export const ScriptRender: FC<IScriptRenderProps> = ({tags}) => {
  return tags.length > 0
    ? createPortal(tags.map((m, i) => <script { ...m } key={ i } data-rh={ "true" }/>), document.head)
    : null;
}