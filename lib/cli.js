#!/usr/bin/env node

const program = require("commander")
const chalk = require('chalk')
const ejs = require('ejs')
const spawn = require('cross-spawn')
const figlet = require('figlet')

// const child = spawn("npm", ["install", "-D"].concat(["vue"]), {
//   stdio: "inherit",
// })
// const spinner = ora("install dependencies starting").start()
// child.on('close', function(code) {
//   if (code !== 0) {
//     spinner.fail("Error while installing denendencies")
//     process.exit(1)
//   } else {
//     spinner.succeed("Install finished")
//   }
// })

// const promptList = [
//   {
//     type: 'input', //type： input, number, confirm, list, checkbox ... 
//     name: 'name', // key 名
//     message: 'Your name', // 提示信息
//     default: 'meo-cli' // 默认值
//   }
// ]; //用户的交互

// inquirer.prompt(promptList).then(answers => {
  // const destUrl = path.join(__dirname, 'templates')
  // const cwdUrl = process.cwd()
  // fs.readdir(destUrl, (err, files) => {
  //   if (err) throw err
  //   files.forEach(file => {
  //     ejs.renderFile(path.join(destUrl, file), answers).then(data => {
  //       fs.writeFileSync(path.join(cwdUrl, file), data)
  //     })
  //   });
  // })
  // console.log(answers); // 返回的结果
// })

const packageJson = require("../package.json")

program
  .version(packageJson.version)
  .command("create <app-name>")
  .usage("[options] [package-name]")
  .description("create a new project")
  .option("--f, --force", "overwrite target directory if it exist") // 是否强制创建，当文件夹已经存在
  .action((name, options) => {
    require("./create.js")(name, options)
  })


program.on('--help', () => {
  console.log(
    `\r\nRun ${chalk.cyan(
      `create-micrr-app <command> --help`
    )} for detailed usage of given command\r\n`
  )
})

// 拿到命令行参数
program.parse(process.argv)