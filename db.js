const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();
const homePath = process.env.HOME || homedir;

const todoFilePath = path.resolve(homePath, '.todo');

const db = {
  read(path = todoFilePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (error, data) => {
          if (error) {
            return reject(error);
          }
          let taskList = '';
          try {
            taskList = JSON.parse(data.toString());
          } catch (error2) {
            taskList = [];
          }
          resolve(taskList);
      })
    })
  },
  write(list, path = todoFilePath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(list), (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      })
    })
  },
};
module.exports = db;
