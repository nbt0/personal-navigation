import React, { useState } from 'react';
import { Form, Input, Modal, message } from 'antd';

const AddWebsiteForm = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error('添加失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="添加网站"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="网站名称"
          rules={[{ required: true, message: '请输入网站名称' }]}
        >
          <Input placeholder="请输入网站名称" />
        </Form.Item>

        <Form.Item
          name="url"
          label="网站地址"
          rules={[
            { required: true, message: '请输入网站地址' },
            { type: 'url', message: '请输入有效的URL' }
          ]}
          extra="例如：https://github.com"
        >
          <Input placeholder="请输入网站地址" />
        </Form.Item>

        <Form.Item
          name="description"
          label="网站描述"
        >
          <Input.TextArea 
            placeholder="请输入网站描述" 
            rows={3}
            showCount
            maxLength={100}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddWebsiteForm; 