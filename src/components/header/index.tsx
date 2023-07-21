import {DownOutlined} from "@ant-design/icons";
import type {RefineThemedLayoutV2HeaderProps} from "@refinedev/antd";
import {useGetIdentity, useGetLocale, useSetLocale} from "@refinedev/core";
import {
  Avatar,
  Button,
  Dropdown,
  Layout as AntdLayout,
  MenuProps,
  Space,
  theme,
  Typography,
} from "antd";
import React from "react";
import {useTranslation} from "react-i18next";
import configs from "../../configs";
import ColorModeComponent from "../colorMode";

const {Text} = Typography;
const {useToken} = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  isSticky,
}) => {
  const {token} = useToken();
  const {i18n} = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const {data: user} = useGetIdentity<IUser>();

  const currentLocale = locale();

  const menuItems: MenuProps["items"] = [...(i18n.languages || [])]
    .sort()
    .map((lang: string) => ({
      key: lang,
      onClick: () => changeLanguage(lang),
      icon: (
        <span style={{marginRight: 8}}>
          <Avatar
            size={16}
            src={`/images/flags/${lang}.svg`}
            style={{
              backgroundColor: configs.primaryColor,
            }}
          />
        </span>
      ),
      label: lang === "en" ? "English" : "Kiswahili",
    }));

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (isSticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      
      <Space>
      <span><Text>Menu</Text></span>
        <Dropdown
          menu={{
            items: menuItems,
            selectedKeys: currentLocale ? [currentLocale] : [],
          }}
        >
          <Button type="text">
            <Space>
              <Avatar
                size={16}
                src={`/images/flags/${currentLocale}.svg`}
                style={{
                  backgroundColor: configs.primaryColor,
                }}
              />
              {currentLocale === "en" ? "English" : "Kiswahili"}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <ColorModeComponent />
        <Space style={{marginLeft: "8px"}} size="middle">
          {user?.name && <Text strong>{user.name}</Text>}
          {user?.avatar && (
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              style={{
                backgroundColor: configs.primaryColor,
              }}
            />
          )}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
