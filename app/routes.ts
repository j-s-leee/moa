import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix("/api", [
    ...prefix("/settings", [
      route("/theme", "features/settings/set-theme.tsx"),
    ]),
  ]),

  index("features/home/home-page.tsx"),
  ...prefix("/auth", [
    route("/login", "features/auth/login-page.tsx"),
    ...prefix("social/:provider", [
      route("/start", "features/auth/social-start-page.tsx"),
      route("/complete", "features/auth/social-complete-page.tsx"),
    ]),
    route("/logout", "features/auth/logout-page.tsx"),
  ]),
  ...prefix("/account", [
    layout("common/components/sidebar-layout.tsx", [
      index("features/account/accounts-page.tsx"),
    ]),
    route("/create", "features/account/page/create-account-page.tsx"),
    route("/delete", "features/account/page/delete-account-page.tsx"),
    ...prefix("/:accountId", [
      route("/edit", "features/account/page/edit-account-page.tsx"),
      route("/invite", "features/account/page/invite-page.tsx"),
      layout("common/components/bottom-nav-sidebar-layout.tsx", [
        route("/dashboard", "features/dashboard/dashboard-page.tsx"),
        route("/manage", "features/manage/manage-page.tsx"),
        route("/goal", "features/goal/goal-page.tsx"),
        route("/analysis", "features/analysis/analysis-page.tsx"),
      ]),
      ...prefix("/manage", [
        route("/budget/add", "features/manage/budget-add-page.tsx"),
        route("/budget/:budgetId", "features/manage/budget-page.tsx"),
        route("/income", "features/manage/income-page.tsx"),
        route("/expense", "features/manage/expense-page.tsx"),
        route("/member", "features/manage/member-page.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
