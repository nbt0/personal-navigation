import { AuthService } from './auth';

const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = '你的GitHub用户名';  // 需要替换
const REPO_NAME = '你的仓库名';  // 需要替换

export const GitHubService = {
  // 获取所有网站数据
  async getWebsites() {
    const token = AuthService.getToken();
    const response = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=website&state=open`,
      {
        headers: token ? {
          'Authorization': `token ${token}`
        } : {}
      }
    );

    if (!response.ok) {
      throw new Error('获取网站列表失败');
    }

    const issues = await response.json();
    return issues.map(issue => {
      const data = JSON.parse(issue.body);
      return {
        id: issue.number,
        title: issue.title,
        ...data
      };
    });
  },

  // 创建新网站
  async createWebsite(website) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('需要先设置 GitHub Token');
    }

    const response = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: website.title,
          body: JSON.stringify({
            url: website.url,
            description: website.description,
            icon: website.icon
          }),
          labels: ['website']
        })
      }
    );

    if (!response.ok) {
      throw new Error('创建网站失败');
    }

    return response.json();
  },

  // 删除网站（关闭 Issue）
  async deleteWebsite(id) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('需要先设置 GitHub Token');
    }

    const response = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/issues/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: 'closed'
        })
      }
    );

    return response.ok;
  }
};
