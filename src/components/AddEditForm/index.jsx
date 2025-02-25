import React from 'react';
import { Form, Input, Modal } from 'antd';

const AddEditForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? "编辑网站" : "添加网站"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
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
        >
          <Input placeholder="请输入网站地址" />
        </Form.Item>

        <Form.Item
          name="description"
          label="网站描述"
        >
          <Input.TextArea placeholder="请输入网站描述" />
        </Form.Item>

        <Form.Item
          name="icon"
          label="图标地址"
        >
          <Input placeholder="请输入图标地址" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditForm; 