import { DropdownKeyEnum } from '@/constants';
import { request } from '@/utils/request';

class CommonApi {
  getOptions(typeKey: DropdownKeyEnum) {
    return request.get({
      url: `/dia-common/getOptions/${typeKey}`,
    });
  }
}

const commonApi = new CommonApi();

export default commonApi;
