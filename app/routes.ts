import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix("api", [
    ...prefix("settings", [route("theme", "features/settings/set-theme.tsx")]),
  ]),

  index("features/home/home-page.tsx"),
  route("login", "features/login/login-page.tsx"),
  ...prefix("/account/:accountId", [
    layout("common/components/history-back-layout.tsx", [
      route("manage/budget/add", "features/manage/budget-add-page.tsx"),
      route("manage/budget/:budgetId", "features/manage/budget-page.tsx"),
      route("manage/income", "features/manage/income-page.tsx"),
      route("manage/expense", "features/manage/expense-page.tsx"),
    ]),
    layout("common/components/bottom-nav-sidebar-layout.tsx", [
      route("dashboard", "features/dashboard/dashboard-page.tsx"),
      route("manage", "features/manage/manage-page.tsx"),
      route("goal", "features/goal/goal-page.tsx"),
      route("analysis", "features/analysis/analysis-page.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
