import {FC, memo} from "react";
import {NoscriptProps} from "../types";
import {useScopedHelmetContext} from "../HelmetScopedProvider";
import {CommonTag} from "./CommonTag";

const isValid = (tag: NoscriptProps) => tag.children !== undefined

const NoscriptTag: FC<NoscriptProps> = (props) => {
    const actions = useScopedHelmetContext().noscriptActions;
    return <CommonTag tagProps={props} actions={actions} isValid={isValid}/>;;
}

export const Noscript = memo(NoscriptTag);
Noscript.displayName = "Noscript";