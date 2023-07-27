import { Table } from 'antd';
import { Pagination } from 'antd';

export const Tables = ({columns,data,onChange}) => 
{
    
    
    return (
      <>
        <Table columns={columns} dataSource={data} onChange={onChange}
          pagination={{ defaultPageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}  
          // style={{ width:1000,marginLeft:'12rem' }}
          />
        {/* <Pagination simple defaultCurrent={1} total={data.length} /> */}
        </>
  );
    };
