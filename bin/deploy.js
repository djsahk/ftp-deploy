#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const chalk = require('chalk');
// 解析命令行参数
const args = process.argv.slice(2);
const index = args.indexOf('--ev');
const env = args[index + 1];

const gulpfilePath = '../gulpfile.js';
const absolutePath = path.resolve(__dirname, gulpfilePath);
const root = process.cwd();

// 执行 gulp 命令
exec(`gulp ftpDeploy --gulpfile ${absolutePath} --ev ${env} --root ${root}`, (error, stdout, stderr) => {
  if (error) {
    console.error(chalk.red(`执行 deploy 命令时出错: ${error}`));
    return;
  }
  if (stderr) {
    console.error(chalk.yellow(`deploy 命令输出: ${stderr}`));
    return;
  }
  console.log(`deploy 命令输出: ${stdout}`);
});
