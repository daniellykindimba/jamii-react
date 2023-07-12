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
import {BillingData, RegionData} from "../../interfaces";

interface RegionsSearchFormData {
  key: string;
}

interface RegionFormData {
  name: string;
}

interface Props {
  height?: any;
  canAdd?: boolean;
}

export const ControlBilling: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [biling, setBilling] = useState<BillingData>();
  const [billings, setBillings] = useState<BillingData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const {push} = useNavigation();
  const [searchForm] = Form.useForm<RegionsSearchFormData>();
  const [form] = Form.useForm<RegionFormData>();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  const [editModal, setEditModal] = useState(false);

  const syncMtaaData = async () => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/region/sync",
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
      getBillings(page, searchKey, limit);
    }
  };

  const cancelDelete = () => {
    message.info("Canceled");
  };

  const columns = [
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text: any, row: any, index: any) => (
        <span>
          <a>{row.reference}</a>
        </span>
      ),
    },
    {
      title: "User/Client",
      dataIndex: "user",
      render: (text: any, row: any, index: any) => (
        <span>
          {row.user.firstName} {row.user.middleName} {row.user.lastName}
        </span>
      ),
    },
    {
      title: "Mobile Phone",
      dataIndex: "phone",
      render: (text: any, row: any, index: any) => (
        <>
          <span>{row.phone}</span>
        </>
      ),
    },
    {
      title: "Service",
      dataIndex: "service",
      render: (text: any, row: any, index: any) => (
        <>
          <span>
            {row.serviceTag
              .replace(/_/g, " ")
              .replace(/\w\S*/g, (w: any) =>
                w.replace(/^\w/, (c: any) => c.toUpperCase())
              )}
          </span>
        </>
      ),
    },
    {
      title: (
        <>
          <div style={{float: "right"}}>Amount</div>
        </>
      ),
      dataIndex: "amount",
      render: (text: any, row: any, index: any) => (
        <div style={{float: "right"}}>
          <span>
            {/* format into thousands separator */}
            {row.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        </div>
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
      render: (text: any, row: any, index: any) => <a>{row.billingStatus}</a>,
    },
    {
      title: "Settled",
      dataIndex: "isSettled",
      render: (text: any, row: any, index: any) => {
        if (row.billingStatus === "paid") {
          if (row.isSettled) {
            return <Button disabled>Yes</Button>;
          } else {
            return (
              <Popconfirm
                title="Force Service Settlement"
                description="Are you sure to settle this service?"
                onConfirm={() => {}}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>No</Button>
              </Popconfirm>
            );
          }
        }
        return null;
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (text: any, row: any, index: any) => (
        <div style={{display: "flex", justifyContent: "flex-end"}}></div>
      ),
    },
  ];

  const getBillings = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url:
        configs.apiUrl + `/billings?page=${start}&limit=${limit}&search=${key}`,
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
      setBillings(data.data);
    }
    setLoading(false);
  };

  const setAllBillsServices = async () => {
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url: configs.apiUrl + `/settle/billing/services`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });

    console.log(data);
  };

  useEffect(() => {
    if ((user?.isAdmin || user?.isStaff) === false) {
      window.location.href = "/";
    }
    getBillings(page, "", 25);
  }, []);

  return (
    <>
      <Row style={{marginTop: 10}}>
        <Col span={12}>
          <Form<RegionsSearchFormData>
            layout="vertical"
            form={searchForm}
            onFinish={(values) => {
              setPage(1);
              billings.length = 0;
              getBillings(1, values.key, limit);
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

        <Col span={12}>
          <div style={{float: "right"}}>
            <Button type="primary" size="large" onClick={setAllBillsServices}>
              Settle All Bills Services
            </Button>
          </div>
        </Col>
      </Row>

      <div>
        <Table
          size="small"
          loading={loading}
          columns={columns}
          dataSource={billings}
          scroll={{x: true}}
          pagination={{
            onChange: (page, pageSize) => {
              setLimit(pageSize);
              getBillings(page, searchKey, pageSize);
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
