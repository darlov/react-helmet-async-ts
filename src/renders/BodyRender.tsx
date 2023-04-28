import {FC, useEffect} from "react";
import {BodyProps} from "../types";
import {renderToStaticMarkup} from "react-dom/server";

interface IBaseRenderProps {
    tag?: BodyProps,
}

const parser = new DOMParser();

export const BodyRender: FC<IBaseRenderProps> = ({tag}) => {
    useEffect(() => {
        if (tag !== undefined) {
            const tt = renderToStaticMarkup(<body {...tag} data-rh={true}/>);
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
    }, [tag])

    return null;
}