import { Query, SelectedValueRefinement, SelectedRangeRefinement } from 'groupby-api';
import { UrlBeautifier, UrlGenerator } from '../../src/url-beautifier';
import { expect } from 'chai';

describe('URL beautifier', () => {
  describe('URL generator', () => {
    let beautifier: UrlBeautifier;
    let generator: UrlGenerator;

    beforeEach(() => {
      beautifier = new UrlBeautifier();
      generator = new UrlGenerator(beautifier);
    });

    it('should convert a simple query to a URL with a custom token', () => {
      expect(generator.build(new Query('red apples'))).to.eq('/red+apples/q');
    });

    it('should convert query with a slash to a URL', () => {
      expect(generator.build(new Query('red/apples'))).to.eq('/red%2Fapples/q');
    });

    it('should convert a simple query to a URL', () => {
      beautifier.config.queryToken = 'a'

      expect(generator.build(new Query('red apples'))).to.eq('/red+apples/a');
    });

    it('should convert a value refinement query to a URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      const query = new Query()
        .withSelectedRefinements(<SelectedValueRefinement>{ navigationName: 'brand', type: 'Value', value: 'DeWalt' });

      expect(generator.build(query)).to.eq('/DeWalt/b')
    });

    it('should convert a refinement with a slash to a URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      const query = new Query()
        .withSelectedRefinements(<SelectedValueRefinement>{ navigationName: 'brand', type: 'Value', value: 'De/Walt' });

      expect(generator.build(query)).to.eq('/De%2FWalt/b')
    });

    it('should convert a multiple refinement query to a URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' }, { h: 'height' });
      const query = new Query()
        .withSelectedRefinements(...(<SelectedValueRefinement[]>[
          { navigationName: 'brand', type: 'Value', value: 'Farmer John' },
          { navigationName: 'height', type: 'Value', value: '20in' }
        ]));

      expect(generator.build(query)).to.eq('/Farmer+John/20in/bh')
    });

    it('should convert query and refinements to a URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      const query = new Query('cool sneakers')
        .withSelectedRefinements(<SelectedValueRefinement>{ navigationName: 'colour', type: 'Value', value: 'green' });

      expect(generator.build(query)).to.eq('/cool+sneakers/green/qc');
    });

    it('should not convert range refinements to a URL', () => {
      beautifier.config.refinementMapping.push({ p: 'price' });
      const query = new Query()
        .withSelectedRefinements(<SelectedRangeRefinement>{ navigationName: 'price', type: 'Range', low: 20, high: 40 });

      expect(() => generator.build(query)).to.throw('cannot map range refinements');
    });

    it('should convert unmapped refinements to a query parameter', () => {
      const query = new Query()
        .withSelectedRefinements(
        <SelectedValueRefinement>{ navigationName: 'colour', type: 'Value', value: 'dark purple' },
        <SelectedRangeRefinement>{ navigationName: 'price', type: 'Range', low: 100, high: 220 }
        );

      expect(generator.build(query)).to.eq('/?refinements=colour%3Ddark+purple~price%3A100..220')
    });

    it('should create canonical URLs', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' }, { h: 'category' });
      const ref1: SelectedValueRefinement = { navigationName: 'colour', type: 'Value', value: 'orange' };
      const ref2: SelectedValueRefinement = { navigationName: 'brand', type: 'Value', value: 'DeWalt' };
      const ref3: SelectedValueRefinement = { navigationName: 'category', type: 'Value', value: 'Drills' };

      const query1 = new Query()
        .withSelectedRefinements(ref1, ref2, ref3);
      const query2 = new Query()
        .withSelectedRefinements(ref3, ref1, ref2);

      expect(generator.build(query1)).to.eq(generator.build(query2))
    });
  });
});
