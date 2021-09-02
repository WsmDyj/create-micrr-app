const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

/**
 * 获取模版信息
 * @returns Promise
 */
async function getRepoList() {
  return axios.get("https://api.github.com/orgs/zhurong-cli/repos")
}

/**
 * 获取版本信息
 */
async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList,
}
