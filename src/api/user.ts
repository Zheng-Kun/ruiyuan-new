import { request } from '@/utils/request';

class UserApi {
  login(data: { username: string; password: string }) {
    return request.post({
      url: '/sys/login',
      data,
    });
  }

  logout() {
    return request.get({
      url: '/sys/logout',
    });
  }

  getUserInfo() {
    return request.get({
      url: '/sys/user/info',
    });
  }

  getUserDetail(userId: string) {
    return request.get({
      url: `/sys/user/info/${userId}`,
    });
  }

  saveUser(data: { password: string; roleIds: string; username: string }) {
    return request.post({
      url: '/sys/user/save',
      data,
    });
  }
}

export default new UserApi();
