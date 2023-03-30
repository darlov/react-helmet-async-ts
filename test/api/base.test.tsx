import {Base, Helmet, HELMET_ATTRIBUTE} from '../../src';
import {customRender} from './utils';


describe('base tag', () => {
    describe('Declarative API', () => {
        it('updates base tag', () => {
            customRender(
                <Helmet>
                    <Base href="http://mysite.com/"/>
                </Helmet>
            );

            const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

            expect(existingTags).toBeDefined();

            const filteredTags = [...existingTags]
                .filter(tag => tag.getAttribute('href') === 'http://mysite.com/');

            expect(filteredTags).toHaveLength(1);
        });

        it('clears the base tag if one is not specified', () => {
            customRender(
                <>
                    <Helmet>
                        <Base href="http://mysite.com/"/>
                    </Helmet>)
                    <Helmet/>
                </>);

            const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

            expect(existingTags).toBeDefined();
            expect(existingTags).toHaveLength(0);
        });

        it("tags without 'href' are not accepted", () => {
            customRender(
                <Helmet>
                    <Base property="won't work"/>
                </Helmet>
            );

            const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

            expect(existingTags).toBeDefined();
            expect(existingTags).toHaveLength(0);
        });

        it('sets base tag based on deepest nested component', () => {
            customRender(
                <div>
                    <Helmet>
                        <Base href="http://mysite.com"/>
                    </Helmet>
                    <Helmet>
                        <Base href="http://mysite.com/public"/>
                    </Helmet>
                </div>
            );

            const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

            expect(existingTags).toBeDefined();
            expect(existingTags).toHaveLength(1);

            const firstTag = [...existingTags][0];

            expect(firstTag).toBeInstanceOf(Element);
            expect(firstTag.getAttribute).toBeDefined();
            expect(firstTag.getAttribute('href')).toBe('http://mysite.com/public');
            expect(firstTag.outerHTML).toMatchSnapshot();
        });

        it('does not render tag when primary attribute is null', () => {
            customRender(
                <Helmet>
                    <Base href={undefined}/>
                </Helmet>
            );

            const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

            expect(existingTags).toHaveLength(0);
        });
    });
});
