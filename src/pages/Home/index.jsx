import React, { useState, useEffect } from 'react';
import { Row, Col, message, Button, Empty, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import WebsiteCard from '../../components/WebsiteCard';
import { GitHubService } from '../../services/github';
import { AuthService } from '../../services/auth';

const Home = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = AuthService.isAuthenticated();

  const loadWebsites = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const data = await GitHubService.getWebsites();
      setWebsites(data || []); // 确保总是设置数组
    } catch (error) {
      if (error.message !== '获取网站列表失败') {
        message.error(error.message);
      }
      setWebsites([]); // 出错时清空列表
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadWebsites();
    }
  }, [isLoggedIn]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        padding: '0 8px'
      }}>
        <h2>欢迎使用个人导航</h2>
        {isLoggedIn && (
          <Button 
            icon={<ReloadOutlined />}
            onClick={loadWebsites}
            loading={loading}
          >
            刷新
          </Button>
        )}
      </div>

      <Spin spinning={loading}>
        {isLoggedIn ? (
          websites.length > 0 ? (
            <Row 
              gutter={[24, 24]}
              style={{ 
                margin: '-12px'
              }}
            >
              {websites.map((website) => (
                <Col 
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={website.id}
                  style={{ 
                    padding: '12px'
                  }}
                >
                  <WebsiteCard 
                    website={website} 
                    onRefresh={loadWebsites}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="暂无网站，点击右上角添加" 
              style={{ 
                margin: '48px 0',
                padding: '24px',
                background: '#fafafa',
                borderRadius: '8px'
              }}
            />
          )
        ) : (
          <Empty 
            description="请先设置 GitHub Token" 
            style={{ 
              margin: '48px 0',
              padding: '24px',
              background: '#fafafa',
              borderRadius: '8px'
            }}
          />
        )}
      </Spin>
    </div>
  );
};

export default Home; 