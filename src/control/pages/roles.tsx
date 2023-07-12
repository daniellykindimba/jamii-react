/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  SearchOutlined,
  DeleteOutlined,
  SyncOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
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
import ReactTimeAgo from "react-time-ago";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import { RoleData, RegionData } from "../../interfaces";

interface searchFormData {
  key: string;
}

interface roleFormData {
  name: string;
}

interface Props {
  height?: any;
  canAdd?: boolean;
}

export const ControlRole: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const [role, setRole] = useState<RoleData>();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const {push} = useNavigation();
  const [searchForm] = Form.useForm<searchFormData>();
  const [form] = Form.useForm<roleFormData>();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  const [editModal, setEditModal] = useState(false);

  const showEditRegionModal = (role: RoleData) => {
    setRole(role);
    setEditModal(true);
  };

  const handleOk = () => {
    setEditModal(false);
  };

  const handleCancel = () => {
    setEditModal(false);
  };

  const onEditFinish = async (values: any) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/region/update/" + values.id,
      method: "post",
    });
  };

  const syncRoles = async () => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/sync/roles",
      method: "get",
    });
    if (data.success) {
      message.success(data.message);
    } else {
      message.error(data.message);
    }
  };

  const confirmDelete = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/region/delete/" + id,
      method: "get",
    })
      .then((res) => {
        if (res.data.success) {
          return res.data;
        } else {
          message.error(res.data.message);
          return {data: {success: false}};
        }
      })
      .catch((err) => {
        message.error(err.message);
        return {data: {success: false}};
      });

    if (data.success) {
      getRoles(page, searchKey, limit);
    }
  };

  const cancelDelete = () => {
    message.info("Canceled");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: any, row: any, index: any) => (
        <span>
          <a>{row.name}</a>
        </span>
      ),
    },
    {
      title: "Created",
      dataIndex: "created",
      render: (text: any, row: any, index: any) => (
        <>
          <span>
            <ReactTimeAgo date={new Date(row.createdAt)} />
          </span>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text: any, row: any, index: any) => (
        <a>
          {row?.isActive ? (
            <span style={{color: "green"}}>Active</span>
          ) : (
            <span style={{color: "red"}}>Inactive</span>
          )}
        </a>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      render: (text: any, row: any, index: any) => (
        <div style={{display: "flex", justifyContent: "flex-end"}}>
          <Popconfirm
            title={"Are you sure to delete this member?"}
            onConfirm={() => confirmDelete(row?.id)}
            onCancel={() => cancelDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />}></Button>
          </Popconfirm>

          <Button
            onClick={() => showEditRegionModal(row)}
            icon={<EditOutlined />}
          ></Button>
        </div>
      ),
    },
  ];

  const getRoles = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url:
        configs.apiUrl + `/roles?page=${start}&limit=${limit}&q=${key}`,
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
      setRoles(data.data);
    }
    setLoading(false);
  };

  

  useEffect(() => {
    if((user?.isAdmin || user?.isStaff) === false){
      window.location.href = "/";
    }
    getRoles(page, "", 25);
  }, []);

  return (
    <>
      <Row style={{marginTop: 10}}>
        <Col span={isMobile ? 24 : 20}>
          <Form<searchFormData>
            layout="vertical"
            form={searchForm}
            onFinish={(values) => {
              setPage(1);
              roles.length = 0;
              getRoles(1, values.key, limit);
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
        <Col
          span={isMobile ? 24 : 4}
          style={{display: "flex", justifyContent: "flex-end"}}
        >
          <Button
            size="large"
            icon={<SyncOutlined />}
            onClick={() => syncRoles()}
          >
            Sync Roles
          </Button>
        </Col>
      </Row>

      <div>
        <Table
          size="small"
          loading={loading}
          columns={columns}
          dataSource={roles}
          scroll={{x: true}}
          pagination={{
            onChange: (page, pageSize) => {
              setLimit(pageSize);
              getRoles(page, searchKey, pageSize);
            },
            total: total,
            pageSize: limit,
            position: ["bottomCenter"],
            showQuickJumper: true,
          }}
        />
      </div>
    </>
  );
};
