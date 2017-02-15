import { SampleTodoNodePage } from './app.po';

describe('sample-todo-node App', function() {
  let page: SampleTodoNodePage;

  beforeEach(() => {
    page = new SampleTodoNodePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
