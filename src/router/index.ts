import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/AuthStore";


function lazyLoad(view: string){
  return () => import(`../views/${view}/index.vue`)
}

const router = createRouter({
  

  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: lazyLoad("Home"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/me",
      name: "Me",
      component: lazyLoad("Me"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/users",
      name: "Users",
      component: lazyLoad("Users"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/personas",
      name: "Personas",
      component: lazyLoad("Personas"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/contacts",
      name: "Contacts",
      component: lazyLoad("Contacts"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/:pathMatch(.*)",
      name: "PageNotFound",
      component: lazyLoad("NotFound"),
    },
    {
      path: "/login",
      name: "Login",
      component: lazyLoad("Login"),
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const isSignedIn = authStore.isSignedIn;
  const accessToken = authStore.accessToken;


  if (to.meta.requiresAuth && !isSignedIn && !accessToken) {
    return "/login";
  }
});

export default router;
