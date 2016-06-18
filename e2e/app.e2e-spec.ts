import { VigilateFrontendPage } from './app.po';

describe('vigilate-frontend App', function() {
  let page: VigilateFrontendPage;

  beforeEach(() => {
    page = new VigilateFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
