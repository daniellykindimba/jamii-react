/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {} from "react";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useLogout,
} from "@refinedev/core";
import {
  Layout as AntdLayout,
  Typography,
  Avatar,
  Space,
  theme,
  Dropdown,
  MenuProps,
  Grid,
} from "antd";
import type {RefineThemedLayoutV2HeaderProps} from "@refinedev/antd";
import {
  ControlFilled,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import configs from "../../configs";
import ColorModeComponent from "../colorMode";

const {Text} = Typography;
const {useToken} = theme;

export const ThemedHeaderV2: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const {token} = useToken();
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const {mutate: logout} = useLogout();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  const shouldRenderHeader = user && (user.name || user.avatar);

  if (!shouldRenderHeader) {
    return null;
  }

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 5;
  }

  const items: MenuProps["items"] = [
    {
      key: "profile-header",
      icon: <UserOutlined />,
      label: <Link to={"/profile"}>Profile</Link>,
    },
    user.isAdmin || user.isStaff
      ? {
          key: "control-header",
          icon: <ControlFilled />,
          label: <Link to={"/control"}>Control Panel</Link>,
          disabled: !(user.isAdmin || user.isStaff),
        }
      : null,
    {
      key: "settings-header",
      icon: <SettingOutlined />,
      label: <Link to={"/settings"}>Settings</Link>,
      disabled: false,
    },
    {
      key: "logout-header",
      label: <a onClick={() => logout()}>Logout</a>,
      icon: <LogoutOutlined />,
      disabled: false,
    },
  ];

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Space size="middle">
          <ColorModeComponent />
          <Dropdown
            menu={{items}}
            trigger={["click"]}
            overlayStyle={{width: "185px"}}
          >
            <a onClick={(e) => e.preventDefault()}>
              {!isMobile && (
                <span style={{marginRight: 10}}>
                  {user?.name && <Text strong>{user.name}</Text>}
                </span>
              )}
              {user?.avatar ? (
                <Avatar
                  icon={<UserOutlined />}
                  alt={user?.name}
                  style={{
                    backgroundColor: configs.primaryColor,
                  }}
                />
              ) : (
                <Avatar
                  icon={<UserOutlined />}
                  alt={user?.name}
                  style={{
                    backgroundColor: configs.primaryColor,
                  }}
                />
              )}
            </a>
          </Dropdown>
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
