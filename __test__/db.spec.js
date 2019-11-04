const db = require('../db');
const fs = require('fs');

jest.mock('fs');

describe('db test', function() {
  it('should return todolist when read /xxx file', async () => {
    let todoList = [{title: '玩游戏', done: false}];
    fs.setReadMock('/xxx', null, JSON.stringify(todoList));
    const getList = await db.read('/xxx');
    expect(getList).toEqual(todoList)
  });

  it('should return todoList when write /zzz file', async () => {
    let todoList = [{title: '玩游戏', done: false}];
    let fakeList;
    fs.setWriteMocks('/zzz', (path, data, callback) => {
      fakeList = data;
      callback(null);
    });
    await db.write(todoList, '/zzz');
    expect(fakeList).toEqual(JSON.stringify(todoList));
  })
});
