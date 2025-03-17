import { createRouter, createWebHistory } from "vue-router";
import Usd from "./views/Usd.vue";
import Cad from "./views/Cad.vue";
import Old from "./views/Old.vue";

const routes = [
  { path: "/", component: Old },
  { path: "/cad", component: Cad },
  { path: "/usd", component: Usd }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = document.cookie.includes('CETGlobalAuth');
  from.request

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return false;
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;