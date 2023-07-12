// define a functional component that render the routes

import {
  DashboardFilled,
  OrderedListOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ThemedLayoutV2, ThemedHeaderV2, ThemedSiderV2, ThemedTitleV2 } from "@refinedev/antd";
import {ErrorComponent} from "@refinedev/core";
import {Menu, Divider} from "antd";
import {Link, Outlet, Route} from "react-router-dom";
import { AppIcon } from "../components/app-icon";

const ControlRoutes = () => {
  return (
    <>
      <Route
        element={
          <ThemedLayoutV2
            Header={() => <ThemedHeaderV2 isSticky={true} />}
            Sider={() => (
              <ThemedSiderV2
                Title={({collapsed}) => (
                  <ThemedTitleV2
                    text="Kikoba"
                    icon={<AppIcon />}
                    collapsed={collapsed}
                  />
                )}
                render={(logout) => (
                  <>
                    <Menu.Item icon={<DashboardFilled />}>
                      <Link to={"/control/home"}>Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item icon={<OrderedListOutlined />}>
                      <Link to={"/control/vikoba"}>Vikoba</Link>
                    </Menu.Item>
                    <Menu.Item icon={<UserOutlined />}>
                      <Link to={"/control/members"}>Members</Link>
                    </Menu.Item>
                    <Menu.Item icon={<OrderedListOutlined />}>
                      <Link to={"/control/regions"}>Regions</Link>
                    </Menu.Item>
                    <Menu.Item icon={<OrderedListOutlined />}>
                      <Link to={"/control/districts"}>Districts</Link>
                    </Menu.Item>
                    <Menu.Item icon={<OrderedListOutlined />}>
                      <Link to={"/control/roles"}>Roles</Link>
                    </Menu.Item>
                    <Divider />
                    <Menu.Item icon={<SettingOutlined />}>
                      <Link to={"/control/settings"}>Settings</Link>
                    </Menu.Item>
                    {logout.logout}
                  </>
                )}
              />
            )}
            Title={({collapsed}) => <ThemedTitleV2 collapsed={collapsed} />}
          >
            <Outlet />
          </ThemedLayoutV2>
        }
      >
        <Route path="/control">
          <Route index element={<>Control Panel</>} />
        </Route>

        <Route path="control/*" element={<ErrorComponent />} />
      </Route>
    </>
  );
};

export default ControlRoutes;
