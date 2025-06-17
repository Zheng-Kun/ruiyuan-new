import { request } from '@/utils/request';

import { PageQueryParams } from './model/pageQueryModel';

class DataSourceApi {
  /**
   * @description: 获取数据源列表
   * @param {PageQueryParams} data
   * @return {*}
   */
  getList(data: PageQueryParams) {
    return request.post({
      url: '/datasource/list',
      data,
    });
  }

  /**
   * @description: 获取数据源预览数据
   * @param {string} id
   * @return {*}
   */
  getTableData(id: string) {
    return request.get({
      url: `/datasource/preview/${id}`,
    });
  }

  /**
   * @description: 导出数据源
   * @param {string} id
   * @return {*}
   */
  exportDataSource(id: string) {
    return request.get({
      url: '/datasource/export',
      params: { tableId: id },
      responseType: 'blob',
    });
  }

  /**
   * @description: 删除数据源
   * @param {string} id
   * @return {*}
   */
  deleteItem(id: string) {
    return request.get({
      url: `/datasource/delete/${id}`,
    });
  }
}

export default new DataSourceApi();
