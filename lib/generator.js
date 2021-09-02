
// 处理项目创建逻辑
const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')

const util = require('util')
const downloadGitRepo = require('download-git-repo')


// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用ora 初始化，传入提示信息 message
  const spinner = ora(message).start()
  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch (error) {
    spinner.fail('Request failed, reftch ...')
  }
}

class Generator {

  constructor(name, targetDir) {
    this.name = name
    this.targetDir = targetDir
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称
  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, 'wating fetch template')
    if (!repoList) return
    // 过滤我们需要的模版名称
    const repos = repoList.map(it => it.name)

    // 2) 用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })
    // return 用户选择的名称
    return repo
  }

  // 获取用户选择的tag
  async getTag(repo) {
    // 基于 repo 的结果。远程拉去相对应的 tag 列表
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo)
    if (!tags) return

    const tagsList = tags.map(it => it.name)

    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Pleace choose a tag to create project'
    })

    return tag
  }

  async download(repo, tag) {
    // 1) 拼接下载地址
    const requestUrl = `zhurong-cli/${repo}${tag ? '#' + tag : ''}`

    // 2) 调用下载方法
    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir) // 参数2: 创建位置
    )
  }

  // 核心创建逻辑
  async create() {

    // 1）获取模板名称
    const repo = await this.getRepo()

    // 2）获取 tag 名称
    const tag = await this.getTag(repo)

    // 3）下载模版到模版目录
    await this.download(repo, tag)

    // 4）模版使用提示

    console.log(`\r\n Successfully create project ${chalk.cyan(this.name)}`)
    console.log(`\r\n cd ${chalk.cyan(this.name)}`)
    console.log(`npm install \r\n`)
    console.log(`npm run dev \r\n`)

    // console.log('用户选择了，repo= ' + chalk.green(repo), 'tag= ' + chalk.green(tag))
  }
}

module.exports = Generator