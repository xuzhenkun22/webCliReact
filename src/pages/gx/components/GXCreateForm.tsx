import { PlusOutlined } from '@ant-design/icons';
import { type ActionType, ModalForm } from '@ant-design/pro-components';
import { ProFormDatePicker, ProFormDigit } from '@ant-design/pro-form/lib';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import type { FC } from 'react';
import { addDay } from '@/services/ant-design-pro/day';

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const GXCreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;

  const [messageApi, contextHolder] = message.useMessage();
  const intl = useIntl();

  const { run, loading } = useRequest(addDay, {
    manual: true,
    onSuccess: () => {
      messageApi.success('新增成功');
      reload?.();
    },
    onError: () => {
      messageApi.error('新增失败, 请再试一次!');
    },
  });

  return (
    <>
      {contextHolder}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.new',
          defaultMessage: '新建',
        })}
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>
        }
        width="780px"
        modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          await run(value);
          return true;
        }}
      >
        <ProFormDatePicker
          label="月份"
          name="month"
          rules={[{ required: true, message: '月份 为必填项' }]}
          picker="month"
          valueFormat="YYYYMM"
        />
        <ProFormDigit label="贡献天数" name="add_day" min={0} max={31} />
        <ProFormDigit label="实际出勤" name="real_day" min={0} max={31} />
        <ProFormDigit
          label="满勤天数（计薪）"
          name="full_attendance_day"
          min={0}
          max={31}
        />
        <ProFormDigit
          label="当月使用年假"
          name="annual_leave_day"
          min={0}
          max={31}
        />
      </ModalForm>
    </>
  );
};

export default GXCreateForm;
