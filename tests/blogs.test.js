let Page = require('./helpers/page');
let page;
beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () => {
    let label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');
  });

  describe('And using valid inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });
    test('Submitting takes user to review screen', async () => {
      let text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });
    test('Submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      let title = await page.getContentsOf('.card-title');
      let content = await page.getContentsOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });

  describe('And using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('the form shows an error message', async () => {
      let titleError = await page.getContentsOf('.title .red-text');
      let contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('User is not logged in', async () => {
  let actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C',
      },
    },
  ];
  test('Blog related actions are prohibited', async () => {
    let results = await page.execRequests(actions);

    for (let result of results) {
      expect(results).toEqual({ error: 'You nmust log in' });
    }
  });
  /*test('User cannot create blog posts', async () => {
    let result = await page.post('/api/blogd', {
      title: 'T',
      content: 'C',
    });
    expect(result).toEqual({ error: 'You must log in' });
  });
  test('User cannot get a list of posts', async () => {
    let result = await page.get('/api/blogs');
    expect(result).toEqual({ error: 'You must log in' });
  });*/
});
