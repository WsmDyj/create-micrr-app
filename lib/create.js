const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require("./generator")

module.exports = async function (name, options) {
  // 当前命令行选择的目录
  const cwd = process.cwd()
  // 需要创建的目录地址
  const targetAir = path.join(cwd, name)
  // 目录是否已经存在？
  if (fs.existsSync(targetAir)) {
    if (options.force) {
      // 是否为强制创建？
      await fs.remove(targetAir)
    } else {
      // todo 询问用户是否需要覆盖
      let { action } = await inquirer.prompt([
        {
          name: 'action',
           type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },{
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])
      if (!action) {
        return 
      } else if (action === 'overwrite') {
        console.log('\r\n Removing...')
        await fs.remove(targetAir)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetAir)

  // 开始创建项目
  generator.create()
}
