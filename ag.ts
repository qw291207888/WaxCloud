import { nextTick } from 'vue';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    await nextTick();

    // 调试信息，查看当前路由名称
    console.log('Current route:', to.name);

    // 访问 localStorage 并检查 authToken
    const token = useState('authToken');

    // 调试信息，查看获取的 authToken
    console.log('Auth token:', token);

    if (!token && to.name !== 'login') {
      // 当没有 token 且目的地不是登录页时，跳转到登录页
      console.log('No token found, navigating to /login');
      return navigateTo('/login');
    } else if (token && to.name === 'login') {
      // 如果已经有 token 并且用户尝试访问登录页面，则重定向到主页
      console.log('Token found, navigating to /');
      return navigateTo('/');
    }
  }
});