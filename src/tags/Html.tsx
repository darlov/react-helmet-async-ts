import { FC } from "react";
import { HtmlProps } from "../types";
import { useScopedHelmetContext } from "../HelmetScopedProvider";
import { _ } from "../utils";
import {CommonTag} from "./CommonTag";

const isValid = (tag: HtmlProps) => !_.isEmpty(tag);

export const Html: FC<HtmlProps> = props => {
  const actions = useScopedHelmetContext().htmlActions;
  return <CommonTag tagProps={props} actions={actions} isValid={isValid}/>;
};
