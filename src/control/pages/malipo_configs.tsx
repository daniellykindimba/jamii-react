/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {SearchOutlined, SyncOutlined} from "@ant-design/icons";
import {useActiveAuthProvider, useGetIdentity} from "@refinedev/core";
import {Button, Col, Form, Grid, Input, Row, message} from "antd";
import {useEffect} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";

interface searchFormData {
  key: string;
}

interface Props {
  height?: any;
  canAdd?: boolean;
}

export const ControlMalipConfigs: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  const syncAPi = async () => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/sync/api/config",
      method: "get",
    });
    if (data.success) {
      message.success(data.message);
    } else {
      message.error(data.message);
    }
  };

  useEffect(() => {
    if ((user?.isAdmin || user?.isStaff) === false) {
      window.location.href = "/";
    }
  }, []);

  return (
    <>
      <Row style={{marginTop: 10}}>
        <Col span={24} style={{display: "flex", justifyContent: "flex-end"}}>
          <Button
            size="large"
            icon={<SyncOutlined />}
            onClick={() => syncAPi()}
          >
            Sync API
          </Button>
        </Col>
      </Row>

      <div></div>
    </>
  );
};
