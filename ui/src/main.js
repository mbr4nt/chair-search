import { createApp } from "vue";
import App from "./App.vue";
import InstantSearch from "vue-instantsearch/vue3/es";
import "instantsearch.css/themes/algolia-min.css";
import router from "./router";

createApp(App)
.use(InstantSearch)
.use(router)
.mount("#app");
