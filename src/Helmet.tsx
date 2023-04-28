import {FC, memo, ReactNode, useEffect, useId, useMemo, useState} from "react";
import {
    createActionsData,
    HelmetScopedContext,
    IHelmetScopedContextData
} from "./HelmetScopedProvider";
import {
    BaseProps, BodyProps, HtmlProps,
    IHelmetInstanceState,
    LinkProps,
    MetaProps,
    NoscriptProps,
    ScriptProps,
    StyleProps,
    TitleProps
} from "./types";
import {_} from "./utils";
import {useHelmetContext} from "./HelmetProvider";
import {Title} from "./tags";

interface IHelmetProps {
    defaultTitle?: ReactNode,
    children?: ReactNode
}

export const Helmet: FC<IHelmetProps> = memo(({children, defaultTitle}) => {
    const [titleTags, setTitleTags] = useState<TitleProps[]>();
    const [metaTags, setMetaTags] = useState<MetaProps[]>();
    const [styleTags, setStyleTags] = useState<StyleProps[]>();
    const [scriptTags, setScriptTags] = useState<ScriptProps[]>();
    const [linkTags, setLinkTags] = useState<LinkProps[]>();
    const [noscriptTags, setNoscriptTags] = useState<NoscriptProps[]>();
    const [baseTags, setBaseTags] = useState<BaseProps[]>();
    const [bodyTags, setBodyTags] = useState<BodyProps[]>();
    const [htmlTags, setHtmlTags] = useState<HtmlProps[]>();
    const rootContext = useHelmetContext();
    const sourceId = useId();
    const id = useMemo(() => {
        return parseInt(sourceId.replace(":r", "").replace(":", ""), 32);
    }, [sourceId])

    const instanceState = useMemo<IHelmetInstanceState>(() => {
        return {
            id,
            emptyState: _.isEmptyArray(titleTags, metaTags, styleTags, scriptTags, linkTags, noscriptTags, baseTags, bodyTags, htmlTags),
            titleTags: titleTags,
            metaTags: metaTags,
            styleTags: styleTags,
            scriptTags: scriptTags,
            linkTags: linkTags,
            noscriptTags: noscriptTags,
            baseTags: baseTags,
            bodyTags: bodyTags,
            htmlTags: htmlTags
        }
    }, [id, titleTags, metaTags, styleTags, scriptTags, linkTags, noscriptTags, baseTags, bodyTags, htmlTags])

    const context = useMemo<IHelmetScopedContextData>(() => {
        return {
            titleActions: createActionsData(setTitleTags),
            metaActions: createActionsData(setMetaTags),
            styleActions: createActionsData(setStyleTags),
            scriptActions: createActionsData(setScriptTags),
            linkActions: createActionsData(setLinkTags),
            noscriptActions: createActionsData(setNoscriptTags),
            baseActions: createActionsData(setBaseTags),
            bodyActions: createActionsData(setBodyTags),
            htmlActions: createActionsData(setHtmlTags)
        }
    }, [setTitleTags, setMetaTags, setStyleTags, setScriptTags, setLinkTags, setBaseTags, setBodyTags, setHtmlTags]);

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