import {HELMET_ATTRIBUTE, Helmet, Noscript} from '../../src';
import {customRender} from './utils';

describe('noscript tags', () => {
    describe('Declarative API', () => {
        it('updates noscript tags', () => {
            customRender(
                <Helmet>
                    <Noscript id="bar">{'<link rel="stylesheet" type="text/css" href="foo.css" />'}</Noscript>
                </Helmet>
            );

            const existingTags = document.head.getElementsByTagName('noscript');

            expect(existingTags).toBeDefined();
            expect(existingTags).toHaveLength(1);
            expect(existingTags[0].id).toBe('bar');
            expect(existingTags[0].outerHTML).toMatchSnapshot();
        });

        it('clears all noscripts tags if none are specified', () => {
            customRender(
                <>
                    <Helmet>
                        <Noscript id="bar">{'<link rel="stylesheet" type="text/css" href="foo.css" />'}</Noscript>
                    </Helmet>
                    <Helmet/>
                </>
            );

            const existingTags = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);

            expect(existingTags).toBeDefined();
            expect(existingTags).toHaveLength(0);
        });

        it("tags without 'innerHTML' are not accepted", () => {
            customRender(
                <Helmet>
                    <Noscript property="won't work"/>
                </Helmet>
            );

            const existingTags = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);

            expect(existingTags).toBeDefined();
            expect(existingTags).toHaveLength(0);
        });

        it('does not render tag when primary attribute is null', () => {
            customRender(
                <Helmet>
                    <Noscript>{undefined}</Noscript>
                </Helmet>
            );

            const existingTags = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);

            expect(existingTags).toHaveLength(0);
        });
    });
});
