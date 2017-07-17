import { KoekatamarinePage } from './app.po';

describe('koekatamarine App', () => {
  let page: KoekatamarinePage;

  beforeEach(() => {
    page = new KoekatamarinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
