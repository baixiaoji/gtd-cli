const inquirer = require('inquirer');
const db = require('./db.js');

module.exports.add = async (taskArr) => {
  const taskList = await db.read();
  taskArr.map(task => taskList.push({
    title: task,
    done: false,
  }));
  await db.write(taskList);
};

module.exports.clear = async () => {
  await db.write([]);
};

function markAsDone(list, index) {
  list[index].done = true;
  db.write(list);
}

function markAsUndone(list, index) {
  list[index].done = false;
  db.write(list);
}

function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '新的标题',
    default: list[index].title,
  }).then(answer => {
    list[index].title = answer.title;
    db.write(list);
  });
}

function remove(list, index) {
  list.splice(index, 1);
  db.write(list);
}

function askForAction(list, index) {
  const actions = {markAsUndone, markAsDone, remove, updateTitle};
  inquirer.prompt({
    type: 'list', name: 'action',
    message: '请选择操作',
    choices: [
      {name: '已完成', value: 'markAsDone'},
      {name: '未完成', value: 'markAsUndone'},
      {name: '改标题', value: 'updateTitle'},
      {name: '删除', value: 'remove'},
      {name: '退出', value: 'quit'},
    ],
  }).then(answer2 => {
    const action = actions[answer2.action];
    action && action(list, index);
  });
}

function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '输入任务标题',
  }).then(answer => {
    list.push({
      title: answer.title,
      done: false,
    });
    db.write(list);
  });
}

function printTaskList(list) {
  inquirer.prompt({
    type: 'list',
    name: 'index',
    message: '请选择你想操作的任务',
    choices: [
      ...list.map((task, index) => ({
        name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`,
        value: index.toString(),
      })),
      {name: '+ 创建任务', value: '-2'},
      {name: '退出', value: '-1'}
      ],
  }).then(answer => {
    const index = parseInt(answer.index);

    if (index >= 0) {
      askForAction(list, index);
    } else if (index === -2) {
      askForCreateTask(list);
    }
  });
}

module.exports.showList = async () => {
  const list = await db.read();
  if (list.length === 0) {
    console.log('there is no task, execute add command');
    return;
  }
  printTaskList(list);
};


