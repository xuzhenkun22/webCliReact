import { FormattedMessage, useRequest } from '@@/exports';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useRef, useState } from 'react';
import GXAdd from '@/pages/gx/components/GXCreateForm';
import { delDay, getDayList } from '@/services/ant-design-pro/day';

const lastMonth = dayjs().subtract(1, 'month').format('YYYY-MM');

const GX: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const actionRef = useRef<ActionType | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<API.DayListItem[]>([]);
  const [totalDay, setTotalDay] = useState('贡献?天!'); // 这里设置总天数为22天
  const [subTitle, setSubTitle] = useState('选择日期查询考勤'); // 这里设置总天数为22天
  const columns: ProColumns<API.DayListItem>[] = [
    {
      title: '主键',
      dataIndex: 'id',
      valueType: 'textarea',
      search: false,
      hideInTable: true,
    },
    {
      title: '月份',
      dataIndex: 'month',
      valueType: 'dateMonth',
      sorter: true,
      search: true,
      initialValue: lastMonth,
    },
    {
      title: '实际出勤',
      dataIndex: 'real_day',
      valueType: 'digit',
      search: false,
    },
    {
      title: '满勤天数（计薪）',
      dataIndex: 'full_attendance_day',
      valueType: 'digit',
      search: false,
    },
    {
      title: '贡献天数',
      dataIndex: 'add_day',
      valueType: 'digit',
      search: false,
      sorter: true,
      render: (_, record) => {
        if (!record || record.add_day === undefined) {
          return <Tag color="cyan">x</Tag>;
        } else if (record.add_day > 0) {
          return <Tag color="geekblue">{record.add_day}</Tag>;
        } else if (record.add_day === 0) {
          return <Tag color="default">{record.add_day}</Tag>;
        } else if (record.add_day < 0) {
          return <Tag color="red">{record.add_day}</Tag>;
        } else {
          return <Tag color="default">{record.add_day}</Tag>;
        }
      },
    },
    {
      title: '当月使用年假',
      dataIndex: 'annual_leave_day',
      valueType: 'digit',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (_, record) => [
        <a key="del" onClick={() => handleRemove([record])}>
          删除
        </a>,
      ],
    },
  ];
  const { run: delRun, loading } = useRequest(delDay, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      messageApi.success('删除成功, 即将刷新');
    },
    onError: () => {
      messageApi.error('删除失败, 请再试一次!');
    },
  });

  const onLoad = (data: API.DayListItem[]) => {
    // 计算总天数
    const total = data?.reduce(
      (sum: number, item: API.DayListItem) => sum + (item.add_day || 0),
      0,
    );
    setTotalDay(`贡献${total}天!`);

    const endMonth = data?.[0]?.month?.substring(0, 7) || '';
    const startMonth = data?.[data.length - 1]?.month?.substring(0, 7) || '';
    if (startMonth > endMonth) {
      setSubTitle(`考勤统计范围:${endMonth}到${startMonth}`);
      return;
    } else if (startMonth < endMonth) {
      setSubTitle(`考勤统计范围:${startMonth}到${endMonth}`);
      return;
    }
  };

  const handleRemove = useCallback(
    async (selectedRows: API.DayListItem[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');
        return;
      }
      await delRun({
        id: selectedRows[0].id || '',
      });
    },
    [delRun, messageApi.warning],
  );
  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.DayListItem, API.PageParams>
        headerTitle={totalDay + subTitle}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <GXAdd key="create" reload={actionRef.current?.reload} />,
        ]}
        request={getDayList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        cardBordered
        onLoad={onLoad}
        pagination={false}
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
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default GX;
