import React from 'react';
import { Card, Button, message, Popconfirm } from 'antd';
import { LinkOutlined, DeleteOutlined } from '@ant-design/icons';
import { GitHubService } from '../../services/github';
import { AuthService } from '../../services/auth';

const WebsiteCard = ({ website, onRefresh }) => {
  const { title, url, description, icon, id } = website;
  const isLoggedIn = AuthService.isAuthenticated();

  // 处理删除
  const handleDelete = async () => {
    try {
      await GitHubService.deleteWebsite(id);
      message.success('删除成功');
      onRefresh?.();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Card
      hoverable
      cover={
        icon && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
            <img 
              alt={title} 
              src={icon} 
              style={{ width: '64px', height: '64px', objectFit: 'contain' }}
            />
          </div>
        )
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