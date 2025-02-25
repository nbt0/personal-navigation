// 使用 Personal Access Token 而不是 OAuth
export const AuthService = {
  // 设置 token
  async setToken(token) {
    // 先验证 token 是否有效
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token 无效');
      }

      // token 有效，保存到 localStorage
      localStorage.setItem('github_token', token);
      return true;
    } catch (error) {
      throw new Error('Token 验证失败，请检查是否有正确的权限');
    }
  },

  // 获取 token
  getToken() {
    return localStorage.getItem('github_token');
  },

  // 检查是否已登录
  isAuthenticated() {
    return !!this.getToken();
  },

  // 登出
  logout() {
    localStorage.removeItem('github_token');
    // 可以添加刷新页面
    window.location.reload();
  }
};
