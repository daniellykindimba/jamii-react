import {Authenticated, Refine} from "@refinedev/core";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import {ErrorComponent, notificationProvider} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {Divider, Menu} from "antd";
import {
  BookOutlined,
  DashboardFilled,
  DashboardOutlined,
  HomeOutlined,
  MoneyCollectFilled,
  OrderedListOutlined,
  SettingOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Routes, Route, Link, Outlet} from "react-router-dom";
import {authProvider} from "./authProvider";
import {ClientHome} from "./client/pages";
import {KikobaView} from "./client/pages/Kikoba";
import {KikobaLoanApproversPage} from "./client/pages/kikoba/loan_approvers";
import {KikobaMembersPage} from "./client/pages/kikoba/members";
import {KikobaTransactionsView} from "./client/pages/kikoba/transactions";
import {ClientLoans} from "./client/pages/loans";
import {ClientVikoba} from "./client/pages/vikoba";
import {AppIcon} from "./components/app-icon";
import configs from "./configs";
import {ControlHome} from "./control/pages";
import {ControlDistrict} from "./control/pages/districts";
import {ControlMembers} from "./control/pages/members";
import {ControlRegions} from "./control/pages/regions";
import {ControlRole} from "./control/pages/roles";
import {ControlVikoba} from "./control/pages/vikoba";
import {Login} from "./pages/login";
import {Register} from "./pages/register";
import {ThemedLayoutV2} from "./components/themedLayout";
import {ThemedHeaderV2} from "./components/themedLayout/header";
import {ThemedSiderV2} from "./components/themedLayout/sider";
import {ThemedTitleV2} from "./components/themedLayout/title";
import {ControlBilling} from "./control/pages/billing";
import {KikobaNamesPage} from "./client/pages/kikoba/names";
import {KikobaDistributionsPage} from "./client/pages/kikoba/distributions";
import {KikobaPayoutApproversPage} from "./client/pages/kikoba/payout_approvers";
import MenuDivider from "antd/es/menu/MenuDivider";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const getJamiiMenues = () => {
  let selectedKey = localStorage.getItem("selected") ?? "/";
  return [
    {
      key: "jamiiHome",
      selected: selectedKey === "jamiiHome" || selectedKey === "/",
      title: "Home",
      icon: (
        <HomeOutlined
          style={{
            color: configs.primaryColor,
          }}
        />
      ),
      element: <ClientHome />,
      path: "/home",
      pathDefination: "/home",
    },
    {
      key: "jamiiVikoba",
      selected: selectedKey === "jamiiVikoba",
      title: "Vikoba",
      icon: (
        <OrderedListOutlined
          style={{
            color: configs.primaryColor,
          }}
        />
      ),
      element: <ClientVikoba />,
      path: "/vikoba",
      pathDefination: "/vikoba",
    },
    {
      key: "jamiiLoans",
      selected: selectedKey === "jamiiLoans",
      title: "My Loans",
      icon: (
        <MoneyCollectFilled
          style={{
            color: configs.primaryColor,
          }}
        />
      ),
      element: <ClientLoans />,
      path: "/loans",
      pathDefination: "/loans",
    },
    {
      key: "jamiiDonations",
      selected: selectedKey === "jamiiDonations",
      title: "Donations",
      icon: (
        <MoneyCollectFilled
          style={{
            color: configs.primaryColor,
          }}
        />
      ),
      element: <>Comming Soon</>,
      path: "/donations",
      pathDefination: "/donations",
    },
    {
      key: "jamiiLearningCenter",
      selected: selectedKey === "jamiiLearningCenter",
      title: "Learning Center",
      icon: (
        <BookOutlined
          style={{
            color: configs.primaryColor,
          }}
        />
      ),
      element: <>Comming Soon</>,
      path: "/learningcenter",
      pathDefination: "/learningcenter",
    },
    {
      key: "jamiiSettings",
      selected: selectedKey === "jamiiSettings",
      title: "Settings",
      icon: (
        <SettingOutlined
          style={{
            color: configs.primaryColor,
          }}
        />
      ),
      element: <>Comming Soon</>,
      path: "/settings",
      pathDefination: "/settings",
    },
  ];
};

const getKikobaMenues = () => {
  let selectedKey = localStorage.getItem("selected") ?? "/";
  var kikoba = localStorage.getItem("kikoba");
  if (kikoba) {
    var kikobaData = JSON.parse(kikoba);
    return [
      {
        key: "kikobaDashboard",
        selected: selectedKey === "kikobaDashboard" || selectedKey === "/",
        title: "Dashboard",
        icon: (
          <DashboardOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <KikobaView />,
        path: `/vikoba/view/${kikobaData.id}/${kikobaData.registrationNumber}`,
        pathDefination: `/vikoba/view/:id/:registrationNumber`,
      },
      {
        key: "kikobaDistributions",
        selected: selectedKey === "kikobaDistributions",
        title: "Distributions",
        icon: (
          <OrderedListOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <KikobaDistributionsPage />,
        path: `/vikoba/${kikobaData.id}/distributions`,
        pathDefination: `/vikoba/:id/distributions`,
      },
      {
        key: "kikobaShareTransactions",
        selected: selectedKey === "kikobaShareTransactions",
        title: "Share Transactions",
        icon: (
          <OrderedListOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <KikobaTransactionsView />,
        path: `/vikoba/${kikobaData.id}/transactions`,
        pathDefination: `/vikoba/:id/transactions`,
      },
      {
        key: "kikobaLoans",
        selected: selectedKey === "kikobaLoans",
        title: "Loans",
        icon: (
          <OrderedListOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <>Comming Soon</>,
        path: `/vikoba/${kikobaData.id}/loans`,
        pathDefination: `/vikoba/:id/loans`,
      },
      {
        key: "kikobaInitialShares",
        selected: selectedKey === "kikobaInitialShares",
        title: "Initial Shares",
        icon: (
          <OrderedListOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <>Comming Soon</>,
        path: `/vikoba/${kikobaData.id}/initialShares`,
        pathDefination: `/vikoba/:id/initialShares`,
      },
      {
        key: "kikobaChargesPenalties",
        selected: selectedKey === "kikobaChargesPenalties",
        title: "Charges/Penalties",
        icon: (
          <OrderedListOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <>Comming Soon</>,
        path: `/vikoba/${kikobaData.id}/penalties`,
        pathDefination: `/vikoba/:id/penalties`,
      },
      {
        key: "kikobaDonations",
        selected: selectedKey === "kikobaDonations",
        title: "Donations",
        icon: (
          <OrderedListOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <>Comming Soon</>,
        path: `/vikoba/${kikobaData.id}/donations`,
        pathDefination: `/vikoba/:id/donations`,
      },
      {
        key: "kikobaMembers",
        selected: selectedKey === "kikobaMembers",
        title: "Members",
        icon: (
          <UserSwitchOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <KikobaMembersPage />,
        path: `/vikoba/${kikobaData.id}/members`,
        pathDefination: `/vikoba/:id/members`,
      },
      {
        key: "kikobaNames",
        selected: selectedKey === "kikobaNames",
        title: "Names",
        icon: (
          <UserSwitchOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <KikobaNamesPage />,
        path: `/vikoba/${kikobaData.id}/names`,
        pathDefination: `/vikoba/:id/names`,
      },
      {
        key: "kikobaLoansApprovers",
        selected: selectedKey === "kikobaLoansApprovers",
        title: "Loan Approvers",
        icon: (
          <UserSwitchOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <KikobaLoanApproversPage />,
        path: `/vikoba/${kikobaData.id}/loans/approvers`,
        pathDefination: `/vikoba/:id/loans/approvers`,
      },
      {
        key: "kikobaPayoutsApprovers",
        selected: selectedKey === "kikobaPayoutsApprovers",
        title: "Payout Approvers",
        icon: (
          <UserSwitchOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <KikobaPayoutApproversPage />,
        path: `/vikoba/${kikobaData.id}/payouts/approvers`,
        pathDefination: `/vikoba/:id/payouts/approvers`,
      },
      {
        key: "kikobaSettings",
        selected: selectedKey === "kikobaSettings",
        title: "Settings",
        icon: (
          <SettingOutlined
            style={{
              color: configs.primaryColor,
            }}
          />
        ),
        element: <>Comming Soon</>,
        path: `/vikoba/${kikobaData.id}/settings`,
        pathDefination: `/vikoba/:id/settings`,
      },
    ];
  } else {
    return [];
  }
};

function App() {
  const {t, i18n} = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={dataProvider(configs.apiUrl)}
            notificationProvider={notificationProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            routerProvider={routerBindings}
            resources={[]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayoutV2
                      Header={() => <ThemedHeaderV2 isSticky sticky={true} />}
                      Sider={() => (
                        <ThemedSiderV2
                          fixed={true}
                          Title={({collapsed}) => (
                            <ThemedTitleV2
                              text={configs.system_name}
                              icon={<AppIcon />}
                              collapsed={collapsed}
                            />
                          )}
                          render={(logout) => (
                            <>
                              {getJamiiMenues().map((menu) => {
                                return (
                                  <Menu.Item icon={menu.icon}>
                                    <Link
                                      to={menu.path}
                                      onClick={() => {
                                        localStorage.setItem(
                                          "selected",
                                          menu.key
                                        );
                                      }}
                                      style={{
                                        fontWeight: menu.selected
                                          ? "bold"
                                          : "normal",
                                      }}
                                    >
                                      {menu.title}
                                    </Link>
                                  </Menu.Item>
                                );
                              })}

                              <MenuDivider color={configs.primaryColor} />

                              {logout.logout}
                            </>
                          )}
                        />
                      )}
                      Title={({collapsed}) => (
                        <ThemedTitleV2 collapsed={collapsed} />
                      )}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="/">
                  <Route index element={<ClientHome />} />
                </Route>
                {getJamiiMenues().map((menu) => {
                  return (
                    <Route path={menu.pathDefination}>
                      <Route index element={menu.element} />
                    </Route>
                  );
                })}

                <Route path="*" element={<ErrorComponent />} />
              </Route>

              <Route
                element={
                  <ThemedLayoutV2
                    Header={() => <ThemedHeaderV2 isSticky sticky={true} />}
                    Sider={() => (
                      <ThemedSiderV2
                        fixed={true}
                        Title={({collapsed}) => (
                          <ThemedTitleV2
                            text={configs.system_name}
                            icon={<AppIcon />}
                            collapsed={collapsed}
                          />
                        )}
                        render={(logout) => {
                          return (
                            <>
                              {getKikobaMenues().map((menu) => {
                                return (
                                  <Menu.Item key={menu.key} icon={menu.icon}>
                                    <Link
                                      to={menu.path}
                                      onClick={() => {
                                        localStorage.setItem(
                                          "selected",
                                          menu.key
                                        );
                                      }}
                                      style={{
                                        fontWeight: menu.selected
                                          ? "bold"
                                          : "normal",
                                      }}
                                    >
                                      {menu.title}
                                    </Link>
                                  </Menu.Item>
                                );
                              })}
                              <MenuDivider color={configs.primaryColor} />
                              {logout.logout}
                            </>
                          );
                        }}
                      />
                    )}
                    Title={({collapsed}) => (
                      <ThemedTitleV2 collapsed={collapsed} />
                    )}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
                }
              >
                {getKikobaMenues().map((menu) => {
                  return (
                    <Route path={menu.pathDefination}>
                      <Route index element={menu.element} />
                    </Route>
                  );
                })}
                <Route path="/control*" element={<ErrorComponent />} />
              </Route>

              <Route
                element={
                  <ThemedLayoutV2
                    Header={() => <ThemedHeaderV2 isSticky sticky={true} />}
                    Sider={() => (
                      <ThemedSiderV2
                        fixed={true}
                        Title={({collapsed}) => (
                          <ThemedTitleV2
                            text={configs.system_name}
                            icon={<AppIcon />}
                            collapsed={collapsed}
                          />
                        )}
                        render={(logout) => (
                          <>
                            <Menu.Item
                              icon={
                                <DashboardFilled
                                  style={{
                                    color: configs.primaryColor,
                                  }}
                                />
                              }
                            >
                              <Link to={"/control/home"}>Dashboard</Link>
                            </Menu.Item>
                            <Menu.Item
                              icon={
                                <MoneyCollectFilled
                                  style={{
                                    color: configs.primaryColor,
                                  }}
                                />
                              }
                            >
                              <Link to={"/control/billing"}>Billing</Link>
                            </Menu.Item>
                            <Menu.Item
                              icon={
                                <OrderedListOutlined
                                  style={{
                                    color: configs.primaryColor,
                                  }}
                                />
                              }
                            >
                              <Link to={"/control/vikoba"}>Vikoba</Link>
                            </Menu.Item>
                            <Menu.Item
                              icon={
                                <UserOutlined
                                  style={{
                                    color: configs.primaryColor,
                                  }}
                                />
                              }
                            >
                              <Link to={"/control/members"}>Members</Link>
                            </Menu.Item>
                            <Menu.Item
                              icon={
                                <OrderedListOutlined
                                  style={{
                                    color: configs.primaryColor,
                                  }}
                                />
                              }
                            >
                              <Link to={"/control/regions"}>Regions</Link>
                            </Menu.Item>
                            <Menu.Item
                              icon={
                                <OrderedListOutlined
                                  style={{
                                    color: configs.primaryColor,
                                  }}
                                />
                              }
                            >
                              <Link to={"/control/districts"}>Districts</Link>
                            </Menu.Item>
                            <Menu.Item
                              icon={
                                <OrderedListOutlined
                                  style={{
                                    color: configs.primaryColor,
                                  }}
                                />
                              }
                            >
                              <Link to={"/control/roles"}>Roles</Link>
                            </Menu.Item>
                            <Divider />
                            <Menu.Item
                              icon={
                                <SettingOutlined
                                  style={{
                                    color: configs.primaryColor,
                                  }}
                                />
                              }
                            >
                              <Link to={"/control/settings"}>Settings</Link>
                            </Menu.Item>
                            {logout.logout}
                          </>
                        )}
                      />
                    )}
                    Title={({collapsed}) => (
                      <ThemedTitleV2 collapsed={collapsed} />
                    )}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
                }
              >
                <Route path="/control">
                  <Route index element={<ControlHome />} />
                  <Route path="home" element={<ControlHome />} />
                  <Route path="billing" element={<ControlBilling />} />
                  <Route path="vikoba" element={<ControlVikoba />} />
                  <Route path="members" element={<ControlMembers />} />
                  <Route path="regions" element={<ControlRegions />} />
                  <Route path="districts" element={<ControlDistrict />} />
                  <Route path="roles" element={<ControlRole />} />
                </Route>

                <Route path="/control*" element={<ErrorComponent />} />
              </Route>

              <Route
                element={
                  <Authenticated fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<>Forgot Password</>} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
