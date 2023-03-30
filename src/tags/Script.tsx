import { FC, memo, useEffect } from "react";
import {ScriptProps} from "../Types";
import { useScopedHelmetContext } from "../HelmetScopedProvider";

const isValid = (tag: ScriptProps) => tag.children !== undefined || tag.src !== undefined

const ScriptTag: FC<ScriptProps> = (props) => {
  const actions = useScopedHelmetContext().scriptActions;

  useEffect(() => {
    if (isValid(props)) {
      actions.add(props);
      return () => actions.remove(props);
    }
  }, [props, actions.add, actions.remove])

  return null;
}

export const Script = memo(ScriptTag);
Script.displayName = "Script";