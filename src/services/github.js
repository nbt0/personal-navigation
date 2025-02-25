import { AuthService } from './auth';

const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'nbt0';  // 已修改为你的用户名
const REPO_NAME = 'personal-navigation';

export const GitHubService = {
  // 获取所有网站数据
  async getWebsites() {
    const token = AuthService.getToken();
    try {
      const response = await fetch(
        `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&labels=website`,
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
        try {
          const data = JSON.parse(issue.body);
          return {
            id: issue.number,
            title: issue.title,
            ...data
          };
        } catch (error) {
          console.error('解析网站数据失败:', error);
          return null;
        }
      }).filter(Boolean); // 过滤掉解析失败的数据
    } catch (error) {
      console.error('获取网站列表错误:', error);
      throw error;
    }
  },

  // 创建新网站
  async createWebsite(website) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('需要先设置 GitHub Token');
    }

    try {
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
              icon: website.icon || 'favicon.ico'
            }),
            labels: ['website']
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '创建网站失败');
      }

      return response.json();
    } catch (error) {
      console.error('创建网站错误:', error);
      throw new Error('创建失败，请检查 Token 权限是否包含 repo 访问权限');
    }
  },

  // 删除网站（关闭 Issue）
  async deleteWebsite(id) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('需要先设置 GitHub Token');
    }

    try {
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '删除失败');
      }

      return true; // 确保返回成功标志
    } catch (error) {
      console.error('删除网站错误:', error);
      throw new Error('删除失败，请检查网络连接');
    }
  }
};
