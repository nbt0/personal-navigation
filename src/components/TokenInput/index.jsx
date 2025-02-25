import React, { useState } from 'react';
import { Input, Button, Space, Typography, message } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { AuthService } from '../../services/auth';

const { Link } = Typography;

const TokenInput = ({ onLogin }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      message.warning('请输入 Token');
      return;
    }

    setLoading(true);
    try {
      await AuthService.setToken(token);
      message.success('Token 验证成功');
      if (typeof onLogin === 'function') {
        onLogin();
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToGithubTokens = () => {
    window.open('https://github.com/settings/tokens/new?description=Personal%20Navigation&scopes=repo', '_blank');
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button 
        type="primary" 
        icon={<GithubOutlined />}
        onClick={goToGithubTokens}
        block
      >
        前往 GitHub 创建 Token
      </Button>
      
      <Input.Password
        placeholder="输入 GitHub Personal Access Token"
        value={token}
        onChange={e => setToken(e.target.value)}
        onPressEnter={handleSubmit}
        disabled={loading}
      />
      
      <Button 
        type="primary" 
        onClick={handleSubmit}
        loading={loading}
        block
      >
        验证并保存
      </Button>
    </Space>
  );
};

export default TokenInput; 