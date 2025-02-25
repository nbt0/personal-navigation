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
    // 如果没有 token，不加载数据
    if (!isLoggedIn) {
      return;
    }

    setLoading(true);
    try {
      const data = await GitHubService.getWebsites();
      setWebsites(data);
    } catch (error) {
      message.error('加载网站列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 只在登录状态下加载数据
    if (isLoggedIn) {
      loadWebsites();
    }
  }, [isLoggedIn]); // 添加 isLoggedIn 作为依赖

  return (
    <div>
      {/* 顶部区域 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px' 
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

      {/* 网站列表 */}
      <Spin spinning={loading}>
        {isLoggedIn ? (
          websites.length > 0 ? (
            <Row gutter={[16, 16]}>
              {websites.map((website) => (
                <Col xs={24} sm={12} md={8} lg={6} key={website.id}>
                  <WebsiteCard website={website} onRefresh={loadWebsites} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="暂无网站，点击右上角添加" 
              style={{ margin: '48px 0' }}
            />
          )
        ) : (
          <Empty 
            description="请先设置 GitHub Token" 
            style={{ margin: '48px 0' }}
          />
        )}
      </Spin>
    </div>
  );
};

export default Home; 