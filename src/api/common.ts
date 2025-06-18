import { DropdownKeyEnum } from '@/constants';
import { request } from '@/utils/request';

class CommonApi {
  getOptions(typeKey: DropdownKeyEnum) {
    return request.get({
      url: `/dropdown/${typeKey}`,
    });
  }
}

const commonApi = new CommonApi();

export default commonApi;
