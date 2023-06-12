import React from "react";
import { Button, Form, Input, Typography } from "antd";

const extractLinks = (text) => {
  const regex =
    /(?:https?):\/\/[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
  return text.match(regex);
};

const sanitizeTag = (tag) => {
  return tag
    .replace(/[\s|\-|_]+/g, "_")
    .replace(/\W/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_/g, "-")
    .toLowerCase();
};

const extractTags = (text) => {
  return text
    .split(";")
    .map(sanitizeTag)
    .filter((x) => x);
};

const BulkAddPage = ({ linksResource }) => {
  const [form] = Form.useForm();
  const { createLink } = linksResource;
  return (
    <div>
      <Typography.Title level={1}>Add links in bulk</Typography.Title>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 60 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={({ tags, links }) => {
          const sanitizedTags = extractTags(tags);
          const sanitizedLinks = extractLinks(links);
          sanitizedLinks.forEach(async (link) => {
            await createLink({
              tags: sanitizedTags,
              location: link,
            });
          });
          form.resetFields();
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Tags"
          name="tags"
          rules={[{ required: true, message: "Add some tags." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Links"
          name="links"
          rules={[
            {
              validator: (rule, value) => {
                if (!extractLinks(value)) {
                  return Promise.reject();
                }
                return Promise.resolve();
              },
              message: "Add text with links.",
            },
          ]}
        >
          <Input.TextArea rows={12} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create tags
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BulkAddPage;
