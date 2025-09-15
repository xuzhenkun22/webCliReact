import { parse } from 'node:url';
import dayjs from 'dayjs';
import type { Request, Response } from 'express';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: API.RuleListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index,
      is_active: i % 6 === 0,
      email: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
      username: `TradeCode ${index}`,
      phone: '曲丽丽',
      role: '这是一段描述',
      created_at: dayjs().format('YYYY-MM-DD'),
      updated_at: dayjs().format('YYYY-MM-DD'),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getRule(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (
    !realUrl ||
    Object.prototype.toString.call(realUrl) !== '[object String]'
  ) {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PageParams &
    API.RuleListItem & {
      sorter: any;
      filter: any;
    };

  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  if (params.sorter) {
    const sorter = JSON.parse(params.sorter);
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      (Object.keys(sorter) as Array<keyof API.RuleListItem>).forEach((key) => {
        const nextSort = next?.[key] as number;
        const preSort = prev?.[key] as number;
        if (sorter[key] === 'descend') {
          if (preSort - nextSort > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }
          return;
        }
        if (preSort - nextSort > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }
  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return (Object.keys(filter) as Array<keyof API.RuleListItem>).some(
          (key) => {
            if (!filter[key]) {
              return true;
            }
            return filter[key].includes(`${item[key]}`);
          },
        );
      });
    }
  }

  if (params.username) {
    dataSource = dataSource.filter((data) =>
      data?.username?.includes(params.username || ''),
    );
  }
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };

  return res.json(result);
}

function postRule(req: Request, res: Response, u: string, b: Request) {
  const body = b?.body || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    case 'delete':
      tableListDataSource = tableListDataSource.filter(
        (item) => key.indexOf(item.id) === -1,
      );
      break;
    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule: API.RuleListItem = {
          is_active: i % 6 === 0,
          email: 'https://ant.design',
          avatar: [
            'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
            'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          ][i % 2],
          username: `TradeCode`,
          phone: '曲丽丽',
          role: '这是一段描述',
          created_at: dayjs().format('YYYY-MM-DD'),
          updated_at: dayjs().format('YYYY-MM-DD'),
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();
      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.id === key) {
            newRule = { ...item, desc, name };
            return { ...item, desc, name };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

export default {
  'GET /api/rule': getRule,
  'POST /api/rule': postRule,
};
