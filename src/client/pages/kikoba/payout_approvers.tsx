/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {SearchOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Popconfirm,
  Row,
  Table,
  message,
} from "antd";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import configs from "../../../configs";
import simpleRestProvider from "../../../api";
import {KikobaLoanApproverData, KikobaPayoutApproverData, RegionData} from "../../../interfaces";
import {LoansApproversToAddComponent} from "../../components/loan_approvers_to_add";

interface searchFormData {
  key: string;
}

interface RegionFormData {
  name: string;
}

interface Props {
  onUpdate?: any;
}

export const KikobaPayoutApproversPage: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [approver, setApprover] = useState<KikobaPayoutApproverData>();
  const [approvers, setApprovers] = useState<KikobaPayoutApproverData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(true);
  const {push} = useNavigation();
  const [addApproverModal, setAddApproverModal] = useState(false);
  const [searchForm] = Form.useForm<searchFormData>();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  let {id} = useParams<{id: string}>();

  const confirmDelete = async (id: number) => {
    message.destroy();
    await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/loan/approver/${id}/delete`,
      method: "get",
    })
      .then((res: any) => {
        if (res.data.success) {
          message.success(res.data.message);
          getApprovers(page, searchKey, limit);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err: any) => {
        message.error(err.message);
      });
  };

  const blockMember = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/kikoba/member/block/" + id,
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
      getApprovers(page, searchKey, limit);
    }
  };

  const unblockMember = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/kikoba/member/unblock/" + id,
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
      getApprovers(page, searchKey, limit);
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      render: (text: any, row: any, index: any) => (
        <span>{row.kikobaMember.member.firstName}</span>
      ),
    },
    {
      title: "Middle Name",
      dataIndex: "middleName",
      render: (text: any, row: any, index: any) => (
        <span>{row.kikobaMember.member.middleName}</span>
      ),
    },
    {
      title: "last Name",
      dataIndex: "lastName",
      render: (text: any, row: any, index: any) => (
        <span>{row.kikobaMember.member.lastName}</span>
      ),
    },
    {
      title: "Mobile Phone",
      dataIndex: "phone",
      render: (text: any, row: any, index: any) => (
        <span>{row.kikobaMember.member.phone}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text: any, row: any, index: any) => (
        <span>{row.kikobaMember.member.email}</span>
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
            <Popconfirm
              title="Block Member"
              description="Are you sure to block Member?"
              onConfirm={() => blockMember(row?.id)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <span style={{color: "green"}}>Active</span>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Unbock Member"
              description="Are you sure to Unblock Member?"
              onConfirm={() => unblockMember(row?.id)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <span style={{color: "red"}}>Inactive</span>
            </Popconfirm>
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
            title={"Are you sure to Delete/Remove this Approver?"}
            placement="topRight"
            onConfirm={() => confirmDelete(row?.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const getApprovers = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url: `${configs.apiUrl}/kikoba/${id}/payout/approvers?page=${start}&limit=${limit}&q=${key}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });
    if (data) {
      if (data.data) {
        setTotal(data.pagination.total);
        setPage(data.pagination.page);
        setLimit(data.pagination.limit);
        setApprovers(data.data);
      }
    }
    setLoading(false);
  };

  const onAddFinish = async () => {
    getApprovers(page, searchKey, limit);
  };

  useEffect(() => {
    getApprovers(page, "", 25);
  }, []);

  return (
    <>
      <Row>
        <Col span={20}>
          <Breadcrumb
            separator=">"
            items={[
              {
                title: <Link to={"/home"}>Home</Link>,
              },
              {
                title: <Link to={"/vikoba"}>Vikoba</Link>,
              },
              {
                title: "Payout Approvers",
              },
            ]}
          />
        </Col>
      </Row>
      <Row style={{marginTop: 10}}>
        <Col span={isMobile ? 24 : 20}>
          <Form<searchFormData>
            layout="vertical"
            form={searchForm}
            onFinish={(values) => {
              setPage(1);
              approvers.length = 0;
              getApprovers(1, values.key, limit);
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
            icon={<PlusOutlined />}
            onClick={() => setAddApproverModal(true)}
          >
            Add Approver
          </Button>
        </Col>
      </Row>

      <div>
        <Table
          size="small"
          loading={loading}
          columns={columns}
          dataSource={approvers}
          scroll={{x: true}}
          pagination={{
            onChange: (page, pageSize) => {
              setLimit(pageSize);
              getApprovers(page, searchKey, pageSize);
            },
            total: total,
            pageSize: limit,
            position: ["bottomCenter"],
            showQuickJumper: true,
          }}
        />
      </div>

      <Modal
        title="Adding Approvers"
        open={addApproverModal}
        destroyOnClose={true}
        width={"45vw"}
        onOk={() => setAddApproverModal(false)}
        onCancel={() => setAddApproverModal(false)}
        footer={[]}
      >
        <LoansApproversToAddComponent kikoba={id} onAdd={onAddFinish} />
      </Modal>
    </>
  );
};
