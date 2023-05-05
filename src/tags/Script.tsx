import { FC, memo } from "react";
import {ScriptProps} from "../types";
import { useScopedHelmetContext } from "../HelmetScopedProvider";
import {CommonTag} from "./CommonTag";

const isValid = (tag: ScriptProps) => tag.children !== undefined || tag.src !== undefined

const ScriptTag: FC<ScriptProps> = (props) => {
  const actions = useScopedHelmetContext().scriptActions;
  return <CommonTag tagProps={props} actions={actions} isValid={isValid}/>;
}

export const Script = memo(ScriptTag);
Script.displayName = "Script";