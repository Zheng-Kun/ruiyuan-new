// 通用请求头content-type
export enum ContentTypeEnum {
  Json = 'application/json;charset=UTF-8',
  FormURLEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  FormData = 'multipart/form-data;charset=UTF-8',
}

// 请求响应状态码
export enum RequestStatusEnum {
  success = 1000, // 成功
  overdue = 4002, // Token过期
  tokenError = 4001, // Token 格式错误
}

// 下拉菜单key
export enum DropdownKeyEnum {
  project = 'project', // 项目
  engineTemplate = 'engine_template', // 智擎模板
}

// 用户角色
export enum UserRoleEnum {
  admin = 0, // 超级管理员 所有权限
  level2 = 1, // 管理员 可创建；可编辑和分配可见范围内的权限
  level3 = 2, // 创作者 可创建；可编辑和分配自己创建的空间权限
}

// 表单文本长度限制(MaxLength)
export const formTextLengthLimit = {
  spaceName: 20, // 空间名称
  spaceDesc: 100, // 空间描述

  projectName: 20, // 项目名称
  projectDesc: 100, // 项目描述

  dataSourceBackgroundDesc: 300, // 数据源背景描述
  dataSourceAnalysisRequirements: 500, // 数据源分析需求

  reportName: 20, // 报表名称
  reportDesc: 100, // 报表描述

  appName: 20, // 应用名称
  appDesc: 100, // 应用描述
};

export const dataSourceFileSizeLimitM = 50; // 数据源文件大小限制50M

export const dataSourceFileTypeList = ['csv', 'xls', 'xlsx']; // 数据源文件类型

// 排序类型枚举
export enum sortTypeEnum {
  createTime = 1, // 创建时间倒序
  updateTime = 3, // 更新时间倒序
  openTime = 2, // 打开时间倒序
  fileName = 4, // 名称A-Z
}

// 排序类型options
export const sortTypeOptions = [
  {
    label: '创建时间(倒序)',
    value: sortTypeEnum.createTime,
  },
  {
    label: '更新时间(倒序)',
    value: sortTypeEnum.updateTime,
  },
  {
    label: '打开时间(倒序)',
    value: sortTypeEnum.openTime,
  },
  {
    label: '文件名称(A-Z)',
    value: sortTypeEnum.fileName,
  },
];

// 数据源请求数据数量
export const dataSourceRequestCount = 1000000000;
