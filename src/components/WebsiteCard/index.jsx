import React from 'react';
import { Card, Button, message, Popconfirm } from 'antd';
import { LinkOutlined, DeleteOutlined } from '@ant-design/icons';
import { GitHubService } from '../../services/github';
import { AuthService } from '../../services/auth';

const WebsiteCard = ({ website, onRefresh }) => {
  const { title, url, description, id } = website;
  const isLoggedIn = AuthService.isAuthenticated();

  // 获取网站图标
  const getFaviconUrl = (websiteUrl) => {
    try {
      const urlObj = new URL(websiteUrl);
      // 使用 favicon.ico 直接访问
      return `${urlObj.origin}/favicon.ico`;
    } catch (error) {
      // 如果解析失败，使用 Google 的服务作为备选
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(websiteUrl)}&sz=64`;
    }
  };

  const handleDelete = async () => {
    try {
      const success = await GitHubService.deleteWebsite(id);
      if (success) {
        message.success('删除成功');
        window.location.reload(); // 删除成功后刷新页面
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Card
      hoverable
      style={{ 
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        height: '100%'  // 确保所有卡片高度一致
      }}
      cover={
        <div style={{ 
          padding: '16px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: '#f5f5f5',
          height: '80px' // 固定高度
        }}>
          <img 
            alt={title} 
            src={getFaviconUrl(url)}
            style={{ 
              width: '32px', 
              height: '32px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              // 如果直接访问失败，切换到 Google 服务
              if (!e.target.dataset.tried) {
                e.target.dataset.tried = 'true';
                e.target.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=64`;
              } else {
                e.target.style.display = 'none';
              }
            }}
          />
        </div>
      }
      actions={[
        <Button 
          key="visit" 
          type="link" 
          icon={<LinkOutlined />}
          onClick={() => window.open(url, '_blank')}
        >
          访问
        </Button>,
        isLoggedIn && (
          <Popconfirm
            key="delete"
            title="确定要删除吗？"
            onConfirm={handleDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        )
      ].filter(Boolean)}
    >
      <Card.Meta
        title={title}
        description={description}
      />
    </Card>
  );
};

export default WebsiteCard; 