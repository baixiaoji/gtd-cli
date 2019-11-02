#!/usr/bin/env node
const program = require('commander');

const api = require('./index.js');

program
.command('add')
.description('add todo task')
.action((command, taskList) => {
  api.add(taskList).then(() => {
    console.log('添加成功');
  }, () => {
    console.log('添加失败');
  });
});

program
.command('clear')
.description('clear all the todo task')
.action(() => {
  api.clear().then(() => {
    console.log('清除成功');
  }, () => {
    console.log('清除失败');
  });
});

program.command('list')
.description('list the task in db')
.action(() => {
  void api.showList();
});

program.parse(process.argv);

if (process.argv.length === 2) {
  void api.showList();
}
