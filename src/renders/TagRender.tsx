import {FC, memo, useMemo} from "react";
import {IHelmetInstanceState} from "../Types";
import {TitleRender} from "./TitleRender";
import {MetaRender} from "./MetaRender";
import {StyleRender} from "./StyleRender";
import {ScriptRender} from "./ScriptRender";
import {LinkRender} from "./LinkRender";
import {NoscriptRender} from "./NoscriptRender";
import {_} from "../Utils";
import {BaseRender} from "./BaseRender";
import {BodyRender} from "./BodyRender";

interface ITagRenderProps {
    instances?: IHelmetInstanceState[],
}

export const TagRender: FC<ITagRenderProps> = memo(({instances}) => {
    const orderedInstances = useMemo(() => _.sortBy(instances, "id"), [instances]);
    if (orderedInstances && orderedInstances.length > 0) {
        return (
            <>
                <TitleRender instances={orderedInstances}/>
                <MetaRender instances={orderedInstances}/>
                <StyleRender instances={orderedInstances}/>
                <ScriptRender instances={orderedInstances}/>
                <LinkRender instances={orderedInstances}/>
                <NoscriptRender instances={orderedInstances}/>
                <BaseRender instances={orderedInstances}/>
                <BodyRender instances={orderedInstances}/>
            </>)
    }

    return null;
});

TagRender.displayName = "TagRender";