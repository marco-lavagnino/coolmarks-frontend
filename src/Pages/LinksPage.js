import { Button, Table, Tag, Typography } from "antd";
import { useState } from "react";

import { DeleteOutlined } from "@ant-design/icons";

import { useDateFiltering } from "../columns/DateColumn";
import { useColumnSearch } from "../columns/SearchableColumn";

import styled from "@emotion/styled";

const { Column } = Table;

const Space = styled.div`
  margin: 1em;
  display: flex;
`;
const SmallText = styled.div`
  font-size: 0.8em;
`;

const LinksPage = ({ linksResource }) => {
  const { links, deleteLink } = linksResource;

  // tag filtering
  const allTags = new Set();
  links.forEach((link) => {
    link.tags.forEach((tag) => allTags.add(tag));
  });

  // selection
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (x) => {
      setSelectedRowKeys(x);
    },
  };

  return (
    <section>
      <Typography.Title level={1}>My Links</Typography.Title>
      <Table
        rowSelection={rowSelection}
        dataSource={links}
        pagination={{ position: ["none", "none"] }}
      >
        <Column
          title="Date added"
          dataIndex="dt"
          key="date"
          render={(date) =>
            date.toDate().toLocaleString(undefined, {
              dateStyle: "long",
              timeStyle: "short",
            })
          }
          {...useDateFiltering("dt")}
        />
        <Column
          title="Title"
          dataIndex="title"
          key="title"
          render={(title, { location }) => {
            return title === location ? (
              <a href={location} target="_blank">
                {location}
              </a>
            ) : (
              <>
                <div>{title}</div>
                <SmallText>
                  <a href={location} target="_blank">
                    {location}
                  </a>
                </SmallText>
              </>
            );
          }}
          {...useColumnSearch("title")}
        />
        <Column
          title="Domain"
          dataIndex="domain"
          key="domain"
          {...useColumnSearch("domain")}
        />
        <Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={(tags) => (
            <>
              {tags.map((tag) => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
            </>
          )}
          filters={Array.from(allTags).map((tag) => ({
            text: tag,
            value: tag,
          }))}
          onFilter={(value, record) => record.tags.includes(value)}
        />
      </Table>
      <Space>
        <Button
          icon={<DeleteOutlined />}
          danger
          disabled={selectedRowKeys.length === 0}
          onClick={() => {
            selectedRowKeys.forEach((id) => deleteLink({ id }));
          }}
        >
          Delete Selected
        </Button>
      </Space>
    </section>
  );
};
export default LinksPage;
