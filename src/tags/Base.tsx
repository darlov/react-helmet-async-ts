import {FC, memo} from "react";
import {BaseProps} from "../types";
import {useScopedHelmetContext} from "../HelmetScopedProvider";
import {CommonTag} from "./CommonTag";

const isValid = (tag: BaseProps) => tag.href !== undefined

const BaseTag: FC<BaseProps> = (props) => {
  const actions = useScopedHelmetContext().baseActions;
  return <CommonTag tagProps={props} actions={actions} isValid={isValid}/>;
}

export const Base = memo(BaseTag);
Base.displayName = "Base";
