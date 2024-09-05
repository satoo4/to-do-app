// src/router/index.js または src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import SignInPage from '../pages/SignInPage.vue';
import TaskPage from '../pages/TaskPage.vue';

const routes = [
  { path: '/', name: 'SignIn', component: SignInPage },
  {
    path: '/tasks',
    name: 'TaskPage',
    component: TaskPage,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
