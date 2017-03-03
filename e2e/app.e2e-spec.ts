import { WebsocketDemoUiPage } from './app.po';

describe('websocket-demo-ui App', function() {
  let page: WebsocketDemoUiPage;

  beforeEach(() => {
    page = new WebsocketDemoUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
