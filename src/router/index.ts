import { localStorageKeys } from "@/config/localStorageKeys";
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
      path: "/editUser/:id?",
      name: "EditUser",
      component: () => import("../views/Users/EditUser/index.vue"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/persons",
      name: "Persons",
      component: lazyLoad("Persons"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/editPerson/:id?",
      name: "EditPerson",
      component: () => import("../views/Persons/EditPerson/index.vue"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/contacts",
      name: "Contacts",
      component: lazyLoad("Contacts"),
      meta: { requiresAuth: true, layout: "Navigator" },
    },
    {
      path: "/editContact/:email?",
      name: "EditContact",
      component: () => import("../views/Contacts/EditContact/index.vue"),
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

  if(to.name == 'PageNotFound'){
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    authStore.setToken(null)
  }

  if ( accessToken && to.name === 'Login') {
    return  '/';
  }
  if (to.meta.requiresAuth && !isSignedIn && !accessToken) {
    return "/login";
  }
});

export default router;
