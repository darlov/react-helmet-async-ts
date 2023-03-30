import {HELMET_ATTRIBUTE, Helmet, Body} from '../../src';
import {customRender} from './utils';
import {BodyProps} from "../../src/Types";
import {_} from "../../src/Utils";

describe('body attributes', () => {
    describe('valid attributes', () => {
        const attributeList: BodyProps & {"data-animal-type": string, "data-dropzone": string} = {
            accessKey: 'c',
            className: 'test',
            contentEditable: 'true',
            contextMenu: 'mymenu',
            "data-animal-type": 'lion',
            dir: 'rtl',
            draggable: 'true',
            "data-dropzone": 'copy',
            hidden: true,
            id: 'test',
            lang: 'fr',
            spellCheck: 'true',
            style: {color: "green"},
            tabIndex: -1,
            title: 'test',
            translate: 'no',
        };

        _.toPairs(attributeList).forEach(([key, attribute]) => {
            it(`${attribute}`, () => {
                const attrValue = attributeList[attribute];

                const attr = {
                    [attribute]: attrValue,
                };

                customRender(
                    <Helmet>
                        <Body {...attr} />
                    </Helmet>
                );

                const bodyTag = document.body;

                const reactCompatAttr = HTML_TAG_MAP[attribute] || attribute;

                expect(bodyTag.getAttribute(reactCompatAttr)).toEqual(attrValue);
                expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual(reactCompatAttr);
            });
        });
    });

    it('updates multiple body attributes', () => {
        customRender(
            <Helmet>
                <Body className="myClassName" tabIndex={-1}/>
            </Helmet>
        );

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('class')).toBe('myClassName');
        expect(bodyTag.getAttribute('tabindex')).toBe('-1');
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('class,tabindex');
    });

    it('sets attributes based on the deepest nested component', () => {
        customRender(
            <div>
                <Helmet>
                    <Body lang="en"/>
                </Helmet>
                <Helmet>
                    <Body lang="ja"/>
                </Helmet>
            </div>
        );

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('lang')).toBe('ja');
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang');
    });

    it('handles valueless attributes', () => {
        customRender(
            <Helmet>
                <Body hidden/>
            </Helmet>
        );

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('hidden')).toBe('true');
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('hidden');
    });

    it('clears body attributes that are handled within helmet', () => {
        customRender(
            <Helmet>
                <Body lang="en" hidden/>
            </Helmet>
        );

        customRender(<Helmet/>);

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('lang')).toBeNull();
        expect(bodyTag.getAttribute('hidden')).toBeNull();
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });

    it('updates with multiple additions and removals - overwrite and new', () => {
        customRender(
            <Helmet>
                <Body lang="en" hidden/>
            </Helmet>
        );

        customRender(
            <Helmet>
                <Body lang="ja" id="body-tag" title="body tag"/>
            </Helmet>
        );

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('hidden')).toBeNull();
        expect(bodyTag.getAttribute('lang')).toBe('ja');
        expect(bodyTag.getAttribute('id')).toBe('body-tag');
        expect(bodyTag.getAttribute('title')).toBe('body tag');
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,id,title');
    });

    it('updates with multiple additions and removals - all new', () => {
        customRender(
            <Helmet>
                <Body lang="en" hidden/>
            </Helmet>
        );

        customRender(
            <Helmet>
                <Body id="body-tag" title="body tag"/>
            </Helmet>
        );

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('hidden')).toBeNull();
        expect(bodyTag.getAttribute('lang')).toBeNull();
        expect(bodyTag.getAttribute('id')).toBe('body-tag');
        expect(bodyTag.getAttribute('title')).toBe('body tag');
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('id,title');
    });

    describe('initialized outside of helmet', () => {
        beforeEach(() => {
            const bodyTag = document.body;
            bodyTag.setAttribute('test', 'test');
        });

        it('attributes are not cleared', () => {
            customRender(<Helmet/>);

            const bodyTag = document.body;

            expect(bodyTag.getAttribute('test')).toBe('test');
            expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
        });

        it('attributes are overwritten if specified in helmet', () => {
            customRender(
                <Helmet>
                    <Body data-test="helmet-attr"/>
                </Helmet>
            );

            const bodyTag = document.body;

            expect(bodyTag.getAttribute('test')).toBe('helmet-attr');
            expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('test');
        });

        it('attributes are cleared once managed in helmet', () => {
            customRender(
                <Helmet>
                    <Body data-test="helmet-attr"/>
                </Helmet>
            );

            customRender(<Helmet/>);

            const bodyTag = document.body;

            expect(bodyTag.getAttribute('test')).toBeNull();
            expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
        });
    });
});
