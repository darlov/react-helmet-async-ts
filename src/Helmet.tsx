import {FC, memo, ReactNode, useEffect, useId, useMemo, useState} from "react";
import {
    createActionsData,
    HelmetScopedContext,
    IHelmetScopedContextData
} from "./HelmetScopedProvider";
import {
    BaseProps, BodyProps,
    IHelmetInstanceState,
    LinkProps,
    MetaProps,
    NoscriptProps,
    ScriptProps,
    StyleProps,
    TitleProps
} from "./Types";
import {_} from "./Utils";
import {useHelmetContext} from "./HelmetProvider";
import {Title} from "./tags";

interface IHelmetProps {
    defaultTitle?: ReactNode,
    children?: ReactNode
}

export const Helmet: FC<IHelmetProps> = memo(({children, defaultTitle}) => {
    const [titles, setTitles] = useState<TitleProps[]>();
    const [metas, setMetas] = useState<MetaProps[]>([]);
    const [styles, setStyles] = useState<StyleProps[]>([]);
    const [scripts, setScripts] = useState<ScriptProps[]>([]);
    const [links, setLinks] = useState<LinkProps[]>([]);
    const [noscripts, setNoscripts] = useState<NoscriptProps[]>([]);
    const [bases, setBases] = useState<BaseProps[]>([]);
    const [bodies, setBodies] = useState<BodyProps[]>([]);
    const rootContext = useHelmetContext();
    const sourceId = useId();
    const id = useMemo(() => {
        return parseInt(sourceId.replace(":r", "").replace(":", ""), 32);
    }, [sourceId])

    const instanceState = useMemo<IHelmetInstanceState | undefined>(() => {
        return {
            id,
            emptyState: _.isEmptyArray(titles, metas, styles, scripts, links, noscripts, bases, bodies),
            titles,
            metas,
            styles,
            scripts,
            links,
            noscripts,
            bases,
            bodies
        }
    }, [id, titles, metas, styles, scripts, links, noscripts, bases, bodies])

    const context = useMemo<IHelmetScopedContextData>(() => {
        return {
            titleActions: createActionsData(setTitles),
            metaActions: createActionsData(setMetas),
            styleActions: createActionsData(setStyles),
            scriptActions: createActionsData(setScripts),
            linkActions: createActionsData(setLinks),
            noscriptActions: createActionsData(setNoscripts),
            baseActions: createActionsData(setBases),
            bodyActions: createActionsData(setBodies)
        }
    }, [setTitles, setMetas, setStyles, setScripts, setLinks, setBases, setBodies]);

    useEffect(() => {
        if (instanceState !== undefined) {
            rootContext.addInstance(instanceState);
            return () => rootContext.removeInstance(instanceState);
        }
    }, [instanceState, rootContext.addInstance, rootContext.removeInstance])

    return (
        <HelmetScopedContext.Provider value={context}>
            {defaultTitle && <Title>{defaultTitle}</Title>}
            {children}
        </HelmetScopedContext.Provider>);
})

Helmet.displayName = "Helmet";