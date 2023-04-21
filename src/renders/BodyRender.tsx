import {FC, useEffect, useMemo} from "react";
import {BodyProps, IHelmetInstanceState} from "../Types";
import {_, mergeTags} from "../Utils";
import {renderToString} from "react-dom/server";

interface IBaseRenderProps {
    instances: IHelmetInstanceState[],
}


const parser = new DOMParser();

export const BodyRender: FC<IBaseRenderProps> = ({instances}) => {
    const bodyProps = useMemo(() => {
        let result: BodyProps | undefined = undefined;

        for (const instance of instances) {
            if (instance.emptyState) {
                result = undefined;
                continue;
            }
            result = (instance.bodies || []).reduce((prev, current) => {
                return {...(prev ?? {}), ...current}
            }, result as BodyProps | undefined)
        }
        return result;
    }, [instances])

    useEffect(() => {
        if (bodyProps !== undefined) {
            const tt = renderToString(<body {...bodyProps} data-rh={true}/>);
            const parsed = parser.parseFromString(tt, "application/xml");
            const body = parsed.querySelector("body");
            const attributes = body!.getAttributeNames().reduce((result, attrName) => {
                const attrValue = body!.getAttribute(attrName);
                if(attrValue !== null){
                    result.push({name: attrName, value: attrValue});
                }           
                return result;
            }, [] as {name: string, value: string}[])

            attributes.forEach(attr => document.body.setAttribute(attr.name, attr.value))

            return () => {
                attributes.forEach(attr => document.body.removeAttribute(attr.name))
            }
        }
    }, [bodyProps])

    return null;
}