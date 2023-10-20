import {KeyOutlined, SearchOutlined} from "@ant-design/icons";
import {useActiveAuthProvider, useGetIdentity} from "@refinedev/core";
import {
  Button,
  Col,
  Form,
  Grid,
  Input,
  Popconfirm,
  Row,
  Table,
  message,
} from "antd";
import {useEffect, useState} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {RegionData, UserData} from "../../interfaces";

interface searchFormData {
  key: string;
}

interface Props {}

export const ControlMembers: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState<UserData[]>([]);
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  const [searchForm] = Form.useForm<searchFormData>();

  const columns = [
    {
      title: "First Name",
      dataIndex: "name",
      key: "name",
      fixed: true,
      render: (text: any, row: any, index: any) => (
        <>
          <span>{row.firstName}</span>
        </>
      ),
    },
    {
      title: "Middle Name",
      dataIndex: "name",
      key: "name",
      render: (text: any, row: any, index: any) => (
        <>
          <span>{row.middleName}</span>
        </>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "name",
      key: "name",
      render: (text: any, row: any, index: any) => (
        <>
          <span>{row.lastName}</span>
        </>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "age",
      key: "age",
      render: (text: any, row: any, index: any) => (
        <>
          <span>{row.phone}</span>
        </>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "address",
      key: "address",
      render: (text: any, row: any, index: any) => (
        <>
          <span>{row.email}</span>
        </>
      ),
    },
    {
      title: (
        <>
          <div style={{float: "right"}}>Action(s)</div>
        </>
      ),
      dataIndex: "actions",
      key: "actions",
      render: (text: any, row: any, index: any) => (
        <>
          <Popconfirm
            title="Reset User Password"
            description="Are you sure to reset user Password?"
            onConfirm={() => resetPassword(row.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<KeyOutlined />} style={{float: "right"}}></Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const getMembers = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url: configs.apiUrl + `/users?page=${start}&limit=${limit}&q=${key}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });

    if (data) {
      setTotal(data.pagination.total);
      setPage(data.pagination.page);
      setLimit(data.pagination.limit);
      setMembers(data.data);
    }
    setLoading(false);
  };

  const resetPassword = async (user_id: number) => {
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url: configs.apiUrl + `/user/${user_id}/password/reset`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });

    if (data) {
      message.success("Password Reset Successful");
    }
  };

  useEffect(() => {
    if ((user?.isAdmin || user?.isStaff) === false) {
      window.location.href = "/";
    }

    getMembers(1);
  }, []);

  return (
    <>
      <Row style={{marginTop: 10}}>
        <Col span={isMobile ? 24 : 12}>
          <Form<searchFormData>
            layout="vertical"
            form={searchForm}
            onFinish={(values) => {
              getMembers(1, values.key);
            }}
          >
            <Form.Item name="key">
              <Input
                size="large"
                placeholder="Search ..."
                prefix={<SearchOutlined />}
                autoComplete="off"
                allowClear
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <div>
        <Table
          size="small"
          dataSource={members}
          columns={columns}
          scroll={{x: true}}
          pagination={{
            total: total,
            pageSize: limit,
            current: page,
          }}
        />
      </div>
    </>
  );
};
