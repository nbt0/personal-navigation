import React, { useState } from 'react';
import { Layout, Button, Modal, message } from 'antd';
import { GithubOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import TokenInput from '../TokenInput';
import { AuthService } from '../../services/auth';
import AddWebsiteForm from '../AddWebsiteForm';
import { GitHubService } from '../../services/github';

const { Header, Content, Footer } = Layout;

// 添加简单的样式
const styles = {
  header: {
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '0 20px'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px'
  },
  content: {
    padding: '24px',
    minHeight: '100vh'
  },
  footer: {
    textAlign: 'center',
    color: '#666'
  }
};

const AppLayout = ({ children }) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isLoggedIn = AuthService.isAuthenticated();

  // 修改添加网站的处理函数
  const handleAddClick = () => {
    if (!isLoggedIn) {
      // 如果没有 token，显示 token 设置弹窗
      setIsTokenModalOpen(true);
    } else {
      // 有 token 则显示添加网站弹窗
      setIsAddModalOpen(true);
    }
  };

  // 处理登录
  const handleLogin = () => {
    setIsTokenModalOpen(true);
  };

  // 处理登录成功
  const handleLoginSuccess = () => {
    setIsTokenModalOpen(false);
    window.location.reload(); // 登录成功后刷新页面
  };

  const handleSubmit = async (values) => {
    try {
      await GitHubService.createWebsite(values);
      message.success('添加成功');
      setIsAddModalOpen(false);
      window.location.reload(); // 添加成功后刷新页面
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Layout>
      {/* 顶部导航栏 Header */}
      <Header style={styles.header}>
        <div style={styles.headerContent}>
          {/* 左侧标题 */}
          <h1 style={styles.title}>个人导航</h1>
          {/* 右侧按钮组 */}
          <div style={styles.buttonGroup}>
            {/* 添加网站按钮 */}
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddClick}
            >
              添加网站
            </Button>
            {isLoggedIn ? (
              <Button 
                icon={<LogoutOutlined />}
                onClick={() => AuthService.logout()}
              >
                退出
              </Button>
            ) : (
              <Button 
                type="primary"
                icon={<GithubOutlined />}
                onClick={handleLogin}
              >
                登录
              </Button>
            )}
          </div>
        </div>
      </Header>

      {/* 主要内容区域 Content */}
      <Content style={styles.content}>
        {children}
      </Content>

      {/* 底部页脚 Footer */}
      <Footer style={styles.footer}>
        基于 GitHub Issues 的个人导航
      </Footer>

      {/* Token 设置弹窗 */}
      <Modal
        title="设置 GitHub Token"
        open={isTokenModalOpen}
        onCancel={() => setIsTokenModalOpen(false)}
        footer={null}
      >
        <TokenInput onLogin={handleLoginSuccess} />
        <div style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>
          <p>如何获取 Token：</p>
          <ol style={{ paddingLeft: '20px' }}>
            <li>访问 GitHub Settings {'->'} Developer settings</li>
            <li>选择 Personal access tokens {'->'} Tokens (classic)</li>
            <li>生成新的 token，勾选 repo 权限</li>
          </ol>
        </div>
      </Modal>

      {/* 添加网站弹窗 */}
      <AddWebsiteForm
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AppLayout; 