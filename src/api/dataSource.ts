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
   * @param {number} id
   * @return {*}
   */
  getTableData(id: number) {
    return request.get({
      url: `/datasource/preview/${id}`,
    });
  }

  /**
   * @description: 导出数据源
   * @param {number} id
   * @return {*}
   */
  exportDataSource(id: number) {
    return request.get({
      url: '/datasource/export',
      params: { tableId: id },
      responseType: 'blob',
    });
  }

  /**
   * @description: 删除数据源
   * @param {number} id
   * @return {*}
   */
  deleteItem(id: number) {
    return request.delete({
      url: `/datasource/${id}`,
    });
  }
}

export default new DataSourceApi();
