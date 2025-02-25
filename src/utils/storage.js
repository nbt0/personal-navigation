// 存储工具类
const STORAGE_KEY = 'websites';

export const StorageUtil = {
  // 获取所有网站
  getAllWebsites() {
    const websites = localStorage.getItem(STORAGE_KEY);
    return websites ? JSON.parse(websites) : [];
  },

  // 添加网站
  addWebsite(website) {
    const websites = this.getAllWebsites();
    websites.push({ ...website, id: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
    return websites;
  },

  // 删除网站
  deleteWebsite(id) {
    const websites = this.getAllWebsites();
    const newWebsites = websites.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWebsites));
    return newWebsites;
  },

  // 更新网站
  updateWebsite(id, website) {
    const websites = this.getAllWebsites();
    const index = websites.findIndex(item => item.id === id);
    if (index !== -1) {
      websites[index] = { ...website, id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
    }
    return websites;
  }
};