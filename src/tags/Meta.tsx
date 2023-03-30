import { FC, memo, useEffect } from "react";
import { useScopedHelmetContext } from "../HelmetScopedProvider";
import { MetaProps, primaryMetaAttributes } from "../Types";

const isMetaValid = (meta: MetaProps) => primaryMetaAttributes.some(attr => meta[attr] !== undefined)

const MetaTag: FC<MetaProps> = (props) => {
  const actions = useScopedHelmetContext().metaActions;

  useEffect(() => {
    if(isMetaValid(props)) {
      actions.add(props);
      return () => actions.remove(props);
    }
  },[props, actions.add, actions.remove])
  
  return null;
}

export const Meta = memo(MetaTag);
Meta.displayName = "Meta";
