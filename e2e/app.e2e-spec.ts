import { ElectronExample01Page } from './app.po';

describe('electron-example01 App', () => {
  let page: ElectronExample01Page;

  beforeEach(() => {
    page = new ElectronExample01Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
