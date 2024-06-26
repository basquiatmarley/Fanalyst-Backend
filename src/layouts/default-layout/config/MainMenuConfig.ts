import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "Master Data",
    route: "/master-data",
    pages: [
      {
        heading: "Banners",
        route: "/banners",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "Pooling Requests",
        route: "/pooling-requests",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "Clubs",
        route: "/clubs",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "Events",
        route: "/events",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "Sports Groups",
        route: "/sports-groups",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "Sports",
        route: "/sports",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "ACCESIBILITY",
    route: "/accessibility",
    pages: [
      {
        heading: "Users",
        route: "/users",
        keenthemesIcon: "user",
        bootstrapIcon: "bi-user",
      },
    ],
  },
];

export default MainMenuConfig;
