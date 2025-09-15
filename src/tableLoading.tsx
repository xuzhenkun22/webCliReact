import ProSkeleton from '@ant-design/pro-skeleton';

const tableLoading: React.FC = () => (
  <div
    style={{
      background: '#fafafa',
      padding: 24,
    }}
  >
    <ProSkeleton type="list" />
  </div>
);

export default tableLoading;
