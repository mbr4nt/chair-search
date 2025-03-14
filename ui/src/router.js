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

export default router;