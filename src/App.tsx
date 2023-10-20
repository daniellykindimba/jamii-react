import React, {lazy} from "react";
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
  DashboardFilled,
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
import {DonationsPage} from "./client/pages/donations";
import {ControlMalipConfigs} from "./control/pages/malipo_configs";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);


// import {ControlHome} from "./control/pages";
// import {ControlDistrict} from "./control/pages/districts";
const ControlDistrict = lazy(() =>
  import("./control/pages/districts").then((module) => ({
    default: module.ControlDistrict,
  }))
);

// import {ControlMembers} from "./control/pages/members";
const ControlMembers = lazy(() =>
  import("./control/pages/members").then((module) => ({
    default: module.ControlMembers,
  }))
);
// import {ControlRegions} from "./control/pages/regions";
const ControlRegions = lazy(() =>
  import("./control/pages/regions").then((module) => ({
    default: module.ControlRegions,
  }))
);
// import {ControlRole} from "./control/pages/roles";
const ControlRole = lazy(() =>
  import("./control/pages/roles").then((module) => ({
    default: module.ControlRole,
  }))
);
// import {ControlVikoba} from "./control/pages/vikoba";
const ControlVikoba = lazy(() =>
  import("./control/pages/vikoba").then((module) => ({
    default: module.ControlVikoba,
  }))
);

// lazy load ControlHome component
const ControlHome = React.lazy(() =>
  import("./control/pages").then((module) => ({default: module.ControlHome}))
);

function App() {
  const {t, i18n} = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const getKikobaId = () => {
    var kikoba = localStorage.getItem("kikoba");
    if (kikoba) {
      var kikobaData = JSON.parse(kikoba);
      return kikobaData.id;
    } else {
      return "";
    }
  };

  const getKikobaRegistrationNumber = () => {
    var kikoba = localStorage.getItem("kikoba");
    if (kikoba) {
      var kikobaData = JSON.parse(kikoba);
      return kikobaData.registrationNumber;
    } else {
      return "";
    }
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
                      Header={() => <ThemedHeaderV2 sticky={true} />}
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
                              <Menu.Item icon={<HomeOutlined />}>
                                <Link to={"/"}>Home</Link>
                              </Menu.Item>
                              <Menu.Item icon={<OrderedListOutlined />}>
                                <Link to={"/vikoba"}>Vikoba</Link>
                              </Menu.Item>
                              <Menu.Item icon={<MoneyCollectFilled />}>
                                <Link to={"/loans"}>My Loans</Link>
                              </Menu.Item>
                              <Menu.Item icon={<MoneyCollectFilled />}>
                                <Link to={"/donations"}>Donations</Link>
                              </Menu.Item>

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
                <Route path="/home">
                  <Route index element={<ClientHome />} />
                </Route>
                <Route path="/vikoba">
                  <Route index element={<ClientVikoba />} />
                </Route>
                <Route path="/loans">
                  <Route index element={<ClientLoans />} />
                </Route>
                <Route path="/donations">
                  <Route index element={<DonationsPage />} />
                </Route>
                <Route path="/learningcenter">
                  <Route index element={<ClientLoans />} />
                </Route>

                <Route path="*" element={<ErrorComponent />} />
              </Route>

              <Route
                element={
                  <ThemedLayoutV2
                    Header={() => <ThemedHeaderV2 sticky={true} />}
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
                              <Menu.Item icon={<HomeOutlined />}>
                                <Link
                                  to={
                                    "/vikoba/view/" +
                                    getKikobaId() +
                                    "/" +
                                    getKikobaRegistrationNumber()
                                  }
                                >
                                  Dashboard
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<OrderedListOutlined />}>
                                <Link
                                  to={
                                    "/vikoba/" +
                                    getKikobaId() +
                                    "/distributions"
                                  }
                                >
                                  Distributions
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<OrderedListOutlined />}>
                                <Link
                                  to={
                                    "/vikoba/" + getKikobaId() + "/transactions"
                                  }
                                >
                                  Share Transactions
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<OrderedListOutlined />}>
                                <Link
                                  to={"/vikoba/" + getKikobaId() + "/loans"}
                                >
                                  Loans
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<OrderedListOutlined />}>
                                <Link
                                  to={
                                    "/vikoba/" +
                                    getKikobaId() +
                                    "/initialShares"
                                  }
                                >
                                  Initial Shares
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<OrderedListOutlined />}>
                                <Link
                                  to={"/vikoba/" + getKikobaId() + "/penalties"}
                                >
                                  Charges/Penalties
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<OrderedListOutlined />}>
                                <Link
                                  to={"/vikoba/" + getKikobaId() + "/donations"}
                                >
                                  Donations
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<UserSwitchOutlined />}>
                                <Link
                                  to={"/vikoba/" + getKikobaId() + "/members"}
                                >
                                  Members
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<UserSwitchOutlined />}>
                                <Link
                                  to={"/vikoba/" + getKikobaId() + "/names"}
                                >
                                  Names
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<UserSwitchOutlined />}>
                                <Link
                                  to={
                                    "/vikoba/" +
                                    getKikobaId() +
                                    "/loans/approvers"
                                  }
                                >
                                  Loan Approvers
                                </Link>
                              </Menu.Item>

                              <Menu.Item icon={<UserSwitchOutlined />}>
                                <Link
                                  to={
                                    "/vikoba/" +
                                    getKikobaId() +
                                    "/payouts/approvers"
                                  }
                                >
                                  Payout Approvers
                                </Link>
                              </Menu.Item>

                              <MenuDivider color={configs.primaryColor} />
                              <Menu.Item icon={<SettingOutlined />}>
                                <Link
                                  to={"/vikoba/" + getKikobaId() + "/settings"}
                                >
                                  Settings
                                </Link>
                              </Menu.Item>
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
                <Route path="/vikoba/view/:id/:registrationNumber">
                  <Route index element={<KikobaView />} />
                </Route>
                <Route path="/vikoba/:id/distributions">
                  <Route index element={<KikobaDistributionsPage />} />
                </Route>
                <Route path="/vikoba/:id/transactions">
                  <Route index element={<KikobaTransactionsView />} />
                </Route>
                <Route path="/vikoba/:id/loans">
                  <Route index element={<KikobaView />} />
                </Route>
                <Route path="/vikoba/:id/initialShares">
                  <Route index element={<KikobaView />} />
                </Route>
                <Route path="/vikoba/:id/penalties">
                  <Route index element={<KikobaView />} />
                </Route>
                <Route path="/vikoba/:id/donations">
                  <Route index element={<KikobaView />} />
                </Route>
                <Route path="/vikoba/:id/members">
                  <Route index element={<KikobaMembersPage />} />
                </Route>
                <Route path="/vikoba/:id/names">
                  <Route index element={<KikobaNamesPage />} />
                </Route>
                <Route path="/vikoba/:id/loans/approvers">
                  <Route index element={<KikobaLoanApproversPage />} />
                </Route>
                <Route path="/vikoba/:id/payouts/approvers">
                  <Route index element={<KikobaPayoutApproversPage />} />
                </Route>
                <Route path="/vikoba/:id/settings">
                  <Route index element={<KikobaView />} />
                </Route>
                <Route path="/control/*" element={<ErrorComponent />} />
              </Route>

              <Route
                element={
                  <ThemedLayoutV2
                    Header={() => <ThemedHeaderV2 sticky={true} />}
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
                              <Link to={"/control/malipo/configs"}>
                                Payment API
                              </Link>
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
                  <Route
                    path="malipo/configs"
                    element={<ControlMalipConfigs />}
                  />
                </Route>

                <Route path="/control/*" element={<ErrorComponent />} />
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
