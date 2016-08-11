import { FluxCapacitor, Events, Navigation as NavigationModel } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { Navigation } from '../../src/tags/navigation/gb-navigation';
import { expect } from 'chai';

describe('gb-navigation logic', () => {
  let tag: Navigation;
  let flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Navigation())));

  it('should have default values', () => {
    tag.init();

    expect(tag.badge).to.be.true;
    expect(tag.showSelected).to.be.true;
  });

  it('should allow override from opts', () => {
    tag.opts = { badge: false, showSelected: false };
    tag.init();

    expect(tag.badge).to.be.false;
    expect(tag.showSelected).to.be.false;
  });

  it('should listen for flux events', () => {
    flux.on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.RESULTS);
      expect(cb).to.eq(tag.updateNavigations);
    };

    tag.init();
  });

  it('should process navigations', () => {
    const availableNavigation = [{ name: 'a', refinements: [{ type: 'Value', value: 'b' }] }];
    const selectedNavigation = [{ name: 'c', refinements: [{ type: 'Value', value: 'd' }] }];
    const results = <any>{ availableNavigation, selectedNavigation };

    const processed = tag.processNavigations(results);
    expect(processed).to.eql({
      a: Object.assign({}, availableNavigation[0], { available: availableNavigation[0].refinements }),
      c: Object.assign({}, selectedNavigation[0], { selected: selectedNavigation[0].refinements })
    });
  });
});
