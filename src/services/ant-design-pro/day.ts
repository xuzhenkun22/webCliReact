/* eslint-disable */
import { request } from '@umijs/max';
import dayjs from 'dayjs';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

/** 获取出勤天数列表  */
export async function getDayList(
  params: {
    pageSize?: number;
    current?: number;
    month?: string;
  },
  options?: { [key: string]: any },
) {
  await waitTime(200);
  console.log('params', params);
  console.log('options', options);
  return request<API.DayList>('/api/attendance/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...params,
      month: params.month ? params.month.replace(/-/g, '') : undefined,
      sorter: options ? { month: options.month, add_day: options.add_day } : {},
    },
    ...(options || {}),
  });
}

/** 新增单月考勤  */
export async function addDay(options?: { [key: string]: any }) {
  return request<API.DayList>('/api/attendance/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...options,
      // 格式化month为yyyyMM
      month: options?.month ? dayjs(options.month).format('YYYYMM') : undefined,
    },
  });
}

/** 新增单月考勤  */
export async function delDay(options?: { [key: string]: any }) {
  return request<API.DayList>('/api/attendance/del', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...options,
    },
  });
}
