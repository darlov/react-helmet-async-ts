import {FC, useEffect} from "react";
import {BaseProps, IHelmetInstanceState} from "../types";
import {useHelmetContext} from "../HelmetProvider";
import {addUniqueItem, removeItem} from "../utils";

const isValid = (tag: BaseProps) => tag.href !== undefined

interface IBaseTag extends BaseProps {
  instance: IHelmetInstanceState
}

const BaseTag: FC<IBaseTag> = ({instance, ...props}) => {
  const rootContext = useHelmetContext();

  useEffect(() => {
    if (isValid(props)) {
      rootContext.updateInstance(instance, "baseTags", props);
      instance.baseTags = addUniqueItem(instance.baseTags, props);
      return () => {
        rootContext.updateInstance(instance, "baseTags", props);
      };
    }
  }, [props, instance])

  if (!rootContext.canUseDOM && isValid(props)) {
    instance.baseTags = addUniqueItem(instance.baseTags, props)
  }

  return null;
}

export const Base = BaseTag;
