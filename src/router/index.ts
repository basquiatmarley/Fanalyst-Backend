import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/pooling-requests",
        name: "pooling-requests-list",
        component: () =>
          import("@/views/crafted/pages/pooling_requests/List.vue"),
        meta: {
          pageTitle: "Pooling Requests List",
          breadcrumbs: ["Pooling Requests List"],
        },
      },
      {
        path: "/clubs",
        name: "clubs-list",
        component: () => import("@/views/crafted/pages/clubs/List.vue"),
        meta: {
          pageTitle: "Clubs List",
          breadcrumbs: ["Clubs List"],
        },
      },
      {
        path: "/clubs/:id",
        name: "clubs-view",
        component: () => import("@/views/crafted/pages/clubs/View.vue"),
        meta: {
          pageTitle: "Clubs View",
          breadcrumbs: ["Clubs", "Clubs View"],
        },
      },
      {
        path: "/clubs/edit/:id",
        name: "clubs-edit",
        component: () => import("@/views/crafted/pages/clubs/Edit.vue"),
        meta: {
          pageTitle: "Clubs Edit",
          breadcrumbs: ["Clubs", "Clubs Edit"],
        },
      },
      {
        path: "/sports-groups",
        name: "sports-groups-list",
        component: () => import("@/views/crafted/pages/sports_groups/List.vue"),
        meta: {
          pageTitle: "Sports Groups List",
          breadcrumbs: ["Sports Groups List"],
        },
      },
      {
        path: "/sports-groups/:id",
        name: "sports-groups-view",
        component: () => import("@/views/crafted/pages/sports_groups/View.vue"),
        meta: {
          pageTitle: "Sports Groups View",
          breadcrumbs: ["Sports Groups", "Sports Groups View"],
        },
      },
      {
        path: "/sports-groups/edit/:id",
        name: "sports-groups-edit",
        component: () => import("@/views/crafted/pages/sports_groups/Edit.vue"),
        meta: {
          pageTitle: "Sports Groups Edit",
          breadcrumbs: ["Sports Groups", "Sports Groups Edit"],
        },
      },
      {
        path: "/sports",
        name: "sports-list",
        component: () => import("@/views/crafted/pages/sports/List.vue"),
        meta: {
          pageTitle: "Sports List",
          breadcrumbs: ["Sports List"],
        },
      },
      {
        path: "/sports/:id",
        name: "sports-view",
        component: () => import("@/views/crafted/pages/sports/View.vue"),
        meta: {
          pageTitle: "Sports View",
          breadcrumbs: ["Sports", "Sports View"],
        },
      },
      {
        path: "/sports/edit/:id",
        name: "sports-edit",
        component: () => import("@/views/crafted/pages/sports/Edit.vue"),
        meta: {
          pageTitle: "Sports Edit",
          breadcrumbs: ["Sports", "Sports Edit"],
        },
      },
      {
        path: "/events",
        name: "events-list",
        component: () => import("@/views/crafted/pages/events/List.vue"),
        meta: {
          pageTitle: "Events List",
          breadcrumbs: ["Events List"],
        },
      },
      {
        path: "/events/:id",
        name: "events-view",
        component: () => import("@/views/crafted/pages/events/View.vue"),
        meta: {
          pageTitle: "Event View",
          breadcrumbs: ["Events List", "Event View"],
        },
      },
      {
        path: "/events/edit/:id",
        name: "events-edit",
        component: () => import("@/views/crafted/pages/events/Edit.vue"),
        meta: {
          pageTitle: "Event Edit",
          breadcrumbs: ["Events List", "Event Edit"],
        },
      },
      {
        path: "/users",
        name: "users-list",
        component: () => import("@/views/crafted/pages/users/List.vue"),
        meta: {
          pageTitle: "Users List",
          breadcrumbs: ["Users List"],
        },
      },
      {
        path: "/users/:id",
        name: "users-view",
        component: () => import("@/views/crafted/pages/users/View.vue"),
        meta: {
          pageTitle: "Users View",
          breadcrumbs: ["Users List", "Users View"],
        },
      },
      {
        path: "/users/edit/:id",
        name: "users-edit",
        component: () => import("@/views/crafted/pages/users/Edit.vue"),
        meta: {
          pageTitle: "Users Edit",
          breadcrumbs: ["Users", "Users Edit"],
        },
      },
      {
        path: "/users/create",
        name: "users-create",
        component: () => import("@/views/crafted/pages/users/Create.vue"),
        meta: {
          pageTitle: "Users Edit",
          breadcrumbs: ["Users", "Users Edit"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll to the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }
});

export default router;
