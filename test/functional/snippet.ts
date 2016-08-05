import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { Snippet } from '../../src/tags/snippet/gb-snippet';
import '../../src/tags/snippet/gb-snippet.tag';

const TAG = 'gb-snippet';

describe(`${TAG} tag`, () => {
  let html: Element;

  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`div.${TAG}`)).to.be.ok;
  });

  function mount() {
    return <Snippet>riot.mount(TAG)[0];
  }
});
