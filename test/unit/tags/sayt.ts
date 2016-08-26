import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../../utils/tags';
import { Sayt } from '../../../src/tags/sayt/gb-sayt';
import { expect } from 'chai';

describe('gb-sayt logic', () => {
  const structure = {};
  let tag: Sayt,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Sayt(), {
    config: { structure }
  })));

  describe('gb-sayt-categories logic', () => {
    it('should return category suggestions when query box content matches a search term suggestion', () => {
      tag.update = ({ categoryResults }) => {

      };

      tag.originalQuery = 'foo';
      const results = {
        searchTerms: ['foo'],

      };
      tag.processResults(results);
    });
  });
});
