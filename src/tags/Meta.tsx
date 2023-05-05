import { FC, memo } from "react";
import { useScopedHelmetContext } from "../HelmetScopedProvider";
import { MetaProps, primaryMetaAttributes } from "../types";
import {CommonTag} from "./CommonTag";

const isValid = (meta: MetaProps) => primaryMetaAttributes.some(attr => meta[attr] !== undefined)

const MetaTag: FC<MetaProps> = (props) => {
  const actions = useScopedHelmetContext().metaActions;  
  return <CommonTag tagProps={props} actions={actions} isValid={isValid}/>;
}

export const Meta = memo(MetaTag);
Meta.displayName = "Meta";
