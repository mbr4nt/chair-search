import { createRouter, createWebHistory } from "vue-router";
import Usd from "./views/Usd.vue";
import Cad from "./views/Cad.vue";
import Old from "./views/Old.vue";

const routes = [
  { path: "/", component: Old },
  { path: "/cad", component: Cad, meta: { requiresAuth: true } },
  { path: "/usd", component: Usd, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = document.cookie.includes('CETGlobalAuth');
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