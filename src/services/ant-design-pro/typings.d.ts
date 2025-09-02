// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };
  interface LoginData {
    login_type: string; // 登录方式（如 "account" 账号密码登录、"mobile" 手机号登录）
    access_token: string; // 核心：访问令牌（后续接口鉴权用）
    token_type: string; // token 类型（如 "bearer"，配合请求头使用）
    user_id: number | string; // 用户唯一标识（可能是数字 ID 或字符串 ID）
    username: string; // 用户名（前端展示用）
    role: string; // 用户角色（如 "admin" 管理员、"user" 普通用户，用于权限控制）
  }
  type LoginResult = {
    success?: boolean;
    data?: LoginData;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    id?: number;
    is_active?: boolean;
    email?: string;
    avatar?: string;
    username?: string;
    role?: string;
    signature?: string;
    title?: string;
    group?: string;
    created_at?: string;
    updated_at?: string;
    phone?: string;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
