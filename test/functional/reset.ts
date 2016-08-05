import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { Reset } from '../../src/tags/reset/gb-reset';
import '../../src/tags/reset/gb-reset.tag';

const TAG = 'gb-reset';

describe(`${TAG} tag`, () => {
  let html: Element;

  beforeEach(() => {
    riot.mixin('test', { flux: new FluxCapacitor('') });
    document.body.appendChild(html = document.createElement(TAG));
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('.gb-reset')).to.be.ok;
    expect(html.querySelector('.gb-reset').textContent).to.eq('×');
  });

  function mount() {
    return <Reset>riot.mount(TAG)[0];
  }
});
