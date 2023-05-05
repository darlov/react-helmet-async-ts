import { FC } from "react";
import { BodyProps } from "../types";
import { useScopedHelmetContext } from "../HelmetScopedProvider";
import { _ } from "../utils";
import {CommonTag} from "./CommonTag";

const isValid = (tag: BodyProps) => !_.isEmpty(tag);

export const Body: FC<BodyProps> = props => {
  const actions = useScopedHelmetContext().bodyActions;
  return <CommonTag tagProps={props} actions={actions} isValid={isValid}/>;
};
