import { Product } from '../../src/tags/product/gb-product';
import { createTag, mixinFlux, removeTag } from './_suite';
import { expect } from 'chai';

const TAG = 'gb-product';

describe(`${TAG} tag`, () => {
  const structure = { title: 'title', price: 'price', image: 'image' };
  const all_meta = { title: 'Red Sneakers', price: '$12.45', image: 'image.png', id: '13323' };
  let html: HTMLElement;

  beforeEach(() => {
    mixinFlux({ config: { structure }, _scope: { opts: {} } });
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-product-image')).to.be.ok;
  });

  it('renders product info', () => {
    mount();

    expect(html.querySelector('gb-product-info')).to.be.ok;
    expect(html.querySelector('.gb-product__title').textContent).to.eq(all_meta.title);
    expect(html.querySelector('.gb-product__price').textContent).to.eq(all_meta.price);
    expect(html.querySelector('img').src).to.include(all_meta.image);
    expect(html.querySelector('a').href).to.include(`details.html?id=${all_meta.id}`);
  });

  describe('product with variants', () => {
    const variantStructure = { image: 'image', price: 'price', id: 'id' };
    const structure = { title: 'title', variants: 'variants', _variantStructure: variantStructure };
    const all_meta = {
      title: 'Sneaky Sneakers',
      variants: [
        {
          image: 'redsneaks.png',
          price: '$2000',
          id: '1.1'
        },
        {
          image: 'greensneaks.png',
          price: '$1',
          id: '1.2'
        }
      ]
    };
    let html: HTMLElement;

    beforeEach(() => {
      mixinFlux({ config: { structure } });
      html = createTag(TAG);
    });
    afterEach(() => removeTag(html));

    it('switches variants', () => {
      const tag = mount({ all_meta });
      expect(tag).to.be.ok;

      expect(html.querySelector('.gb-product__title').textContent).to.eq('Sneaky Sneakers');
      expect(html.querySelector('.gb-product__price').textContent).to.eq('$2000');
      expect(html.querySelector('img').src).to.include('redsneaks.png');
      expect(html.querySelector('a').href).to.include('details.html?id=1.1');

      expect(variantLinks().length).to.eq(2);
      expect((<DOMStringMap & any>(variantLinks()[0]).dataset).index).to.eq('0');
      expect((<DOMStringMap & any>(variantLinks()[1]).dataset).index).to.eq('1');

      variantLinks()[0].click();

      expect(html.querySelector('.gb-product__title').textContent).to.eq('Sneaky Sneakers');
      expect(html.querySelector('.gb-product__price').textContent).to.eq('$2000');
      expect(html.querySelector('img').src).to.include('redsneaks.png');
      expect(html.querySelector('a').href).to.include('details.html?id=1.1');

      variantLinks()[1].click();

      expect(html.querySelector('.gb-product__title').textContent).to.eq('Sneaky Sneakers');
      expect(html.querySelector('.gb-product__price').textContent).to.eq('$1');
      expect(html.querySelector('img').src).to.include('greensneaks.png');
      expect(html.querySelector('a').href).to.include('details.html?id=1.2');

      variantLinks()[0].click();

      expect(html.querySelector('.gb-product__title').textContent).to.eq('Sneaky Sneakers');
      expect(html.querySelector('.gb-product__price').textContent).to.eq('$2000');
      expect(html.querySelector('img').src).to.include('redsneaks.png');
      expect(html.querySelector('a').href).to.include('details.html?id=1.1');
    });

    function variantLinks() {
      return <NodeListOf<HTMLAnchorElement>>html.querySelectorAll('.gb-product__variant-link');
    }
  });

  function mount(opts: any = { all_meta }) {
    return <Product>riot.mount(TAG, opts)[0];
  }
});
