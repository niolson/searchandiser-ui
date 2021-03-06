import { Collections } from '../../src/tags/collections/gb-collections';
import suite from './_suite';
import { expect } from 'chai';

suite<Collections>('gb-collections', ({ flux, html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
  });

  it('renders as list by default', () => {
    mount();

    expect(html().querySelector('gb-list')).to.be.ok;
    expect(html().querySelector('gb-select')).to.not.be.ok;
  });

  it('renders as dropdown when configured', () => {
    const tag = mount();
    tag.update({ dropdown: true });

    expect(html().querySelector('gb-list')).to.not.be.ok;
    expect(html().querySelector('gb-select')).to.be.ok;
  });

  it('renders without collections', () => {
    mount();
    expect(html().querySelector('.gb-collection')).to.not.be.ok;
  });

  it('renders with collections', () => {
    const tag = mount();
    tag.collections = ['first', 'second', 'third'];
    tag.counts = { first: 344, second: 453, third: 314 };

    tag.update();
    expect(labels().length).to.eq(3);
    expect(labels()[1].textContent).to.eq('second');
    expect(counts()[1].textContent).to.eq('453');
  });

  it('renders with collection labels', () => {
    const tag = mount();
    tag.collections = ['first', 'second', 'third'];
    tag.labels = { first: '1', second: '2', third: '3' };

    tag.update();
    expect(labels().length).to.eq(3);
    expect(labels()[1].textContent).to.eq('2');
  });

  it('renders without collection counts', () => {
    const tag = mount();
    tag.fetchCounts = false;
    tag.collections = ['first', 'second', 'third'];

    tag.update();
    expect(counts().length).to.eq(0);
  });

  it('switches collection on click', () => {
    const collections = ['a', 'b', 'c'];
    const tag = mount();
    tag.collections = collections;

    flux().switchCollection = (collection): any => expect(collection).to.eq(collections[1]);

    tag.update();
    (<HTMLAnchorElement>html().querySelectorAll('.gb-collection')[1]).click();
  });

  it('switches collection on dropdown', () => {
    const collections = ['a', 'b', 'c'];
    const tag = mount();
    tag.collections = collections;

    tag.onselect = (collection): any => expect(collection).to.eq(collections[1]);

    tag.update();
    (<HTMLAnchorElement>html().querySelectorAll('.gb-collection')[1]).click();
  });

  function labels() {
    return <NodeListOf<HTMLSpanElement>>html().querySelectorAll('.gb-collection__name');
  }

  function counts() {
    return <NodeListOf<HTMLSpanElement>>html().querySelectorAll('gb-badge');
  }
});
