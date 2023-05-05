import {FC, memo, useCallback, useEffect} from "react";
import {useScopedHelmetContext} from "../HelmetScopedProvider";
import {TitleProps} from "../types";
import {CommonTag} from "./CommonTag";


const emptyFallback =() => {
  return  {children: ""};
};

const TitleTag: FC<TitleProps> = (props) => {
    const actions = useScopedHelmetContext().titleActions;
    return <CommonTag tagProps={props} actions={actions} emptyFallback={emptyFallback}/>;
}

export const Title = memo(TitleTag);
Title.displayName = "Title";