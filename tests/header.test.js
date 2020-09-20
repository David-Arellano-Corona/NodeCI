let Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('the header has the correct text', async () => {
  let text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('Clicking login start oauth flow', async () => {
  await page.click('.right a');
  let url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  //let id = '5f56f7d97f92fcf929a93141';
  await page.login();
  let text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  expect(text).toEqual('Logout');
});
