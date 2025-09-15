import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer } from 'antd';
import React, { useRef, useState } from 'react';
import { getDayList } from '@/services/ant-design-pro/day';

const DayTableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.DayListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.DayListItem[]>([]);

  const columns: ProColumns<API.DayListItem>[] = [
    {
      title: '主键',
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '年份',
      dataIndex: 'year',
      valueType: 'dateYear',
    },
    {
      title: '月份',
      dataIndex: 'month',
      valueType: 'dateMonth',
    },
    {
      title: '满勤天数（计薪）',
      dataIndex: 'full_attendance_day',
      valueType: 'digit',
    },
    {
      title: '实际出勤',
      dataIndex: 'real_day',
      valueType: 'digit',
    },
    {
      title: '贡献天数',
      dataIndex: 'add_day',
      valueType: 'digit',
    },
    {
      title: '年假',
      dataIndex: 'annual_leave_day',
      valueType: 'digit',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.DayListItem, API.PageParams>
        headerTitle="考勤列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={getDayList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        // 新增pagination属性，设置默认每页条数为20
        pagination={{
          pageSize: 10, // 这里设置每页默认显示20条数据，可根据需求修改
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage
                id="pages.searchTable.chosen"
                defaultMessage="Chosen"
              />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage
                id="pages.searchTable.item"
                defaultMessage="项"
              />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce(
                  (pre, item) => pre + (item.id ?? 0),
                  0,
                )}{' '}
                <FormattedMessage
                  id="pages.searchTable.tenThousand"
                  defaultMessage="万"
                />
              </span>
            </div>
          }
        >
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.year && (
          <ProDescriptions<API.DayListItem>
            column={2}
            title={currentRow?.year}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.DayListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default DayTableList;
