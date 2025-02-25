import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { AuthService } from '../../services/auth';

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
      onLogin?.();
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
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
      >
        验证并保存
      </Button>
    </div>
  );
};

export default TokenInput; 