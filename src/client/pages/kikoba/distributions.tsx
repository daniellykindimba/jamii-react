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
    Modal,
    Popconfirm,
    Row,
    Table,
    message,
  } from "antd";
  import {useState, useEffect} from "react";
  import {useParams} from "react-router-dom";
  import ReactTimeAgo from "react-time-ago";
  import simpleRestProvider from "../../../api";
  import configs from "../../../configs";
  import {KikobaMemberData, RegionData} from "../../../interfaces";
  import {EditKikobaMemberInforamtionFormComponent} from "../../components/form/edit_kikoba_member_information";
  
  interface RegionsSearchFormData {
    key: string;
  }
  
  interface RegionFormData {
    name: string;
  }
  
  interface Props {
    onUpdate?: any;
  }
  
  export const KikobaDistributionsPage: React.FC<Props> = (props: Props) => {
    const authProvider = useActiveAuthProvider();
    const {data: user} = useGetIdentity({
      v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });
  
    const [member, setMember] = useState<KikobaMemberData>();
    const [members, setMembers] = useState<KikobaMemberData[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(20);
    const [searchKey, setSearchKey] = useState("");
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(true);
    const {push} = useNavigation();
    const [editMemberModal, setEditMemberModal] = useState(false);
    const [searchForm] = Form.useForm<RegionsSearchFormData>();
    const [form] = Form.useForm<RegionFormData>();
    const breakpoint = Grid.useBreakpoint();
    const isMobile = !breakpoint.lg;
  
    let {id} = useParams<{id: string}>();
  
    const [editModal, setEditModal] = useState(false);
  
    const showEditRegionModal = (member: KikobaMemberData) => {
      setMember(member);
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
        getMembers(page, searchKey, limit);
      }
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
        getMembers(page, searchKey, limit);
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
        getMembers(page, searchKey, limit);
      }
    };
  
    const cancelDelete = () => {
      message.info("Canceled");
    };
  
    const columns = [
      {
        title: "First Name",
        dataIndex: "firstName",
        render: (text: any, row: any, index: any) => (
          <span>{row.member.firstName}</span>
        ),
      },
      {
        title: "Middle Name",
        dataIndex: "middleName",
        render: (text: any, row: any, index: any) => (
          <span>{row.member.middleName}</span>
        ),
      },
      {
        title: "last Name",
        dataIndex: "lastName",
        render: (text: any, row: any, index: any) => (
          <span>{row.member.lastName}</span>
        ),
      },
      {
        title: "Nickname",
        dataIndex: "nickname",
        render: (text: any, row: any, index: any) => (
          <span>{row.nickname && <>{row.nickname}</>}</span>
        ),
      },
      {
        title: "Contribution Name",
        dataIndex: "contributionName",
        render: (text: any, row: any, index: any) => (
          <span>{row.contributionName}</span>
        ),
      },
      {
        title: "Mobile Phone",
        dataIndex: "phone",
        render: (text: any, row: any, index: any) => (
          <span>{row.member.phone}</span>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (text: any, row: any, index: any) => (
          <span>{row.member.email}</span>
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
              title={"Are you sure to delete this member?"}
              onConfirm={() => confirmDelete(row?.id)}
              onCancel={() => cancelDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                style={{marginRight: 3}}
              ></Button>
            </Popconfirm>
  
            <Button
              type="primary"
              onClick={() => handleEditMember(row)}
              icon={<EditOutlined />}
            ></Button>
          </div>
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
        url:
          configs.apiUrl +
          `/kikoba/${id}/members?page=${start}&limit=${limit}&q=${key}`,
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
  
    const handleEditMember = async (member: KikobaMemberData) => {
      setMember(member);
      setEditMemberModal(true);
    };
  
    const onFinishEdit = async () => {
      setEditMemberModal(false);
      getMembers(page, searchKey, limit);
    };
  
    useEffect(() => {
      getMembers(page, "", 25);
    }, []);
  
    return (
      <>
        <Row style={{marginTop: 10}}>
          <Col span={isMobile ? 24 : 20}>
            <Form<RegionsSearchFormData>
              layout="vertical"
              form={searchForm}
              onFinish={(values) => {
                setPage(1);
                members.length = 0;
                getMembers(1, values.key, limit);
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
            loading={loading}
            columns={columns}
            dataSource={members}
            scroll={{x: true}}
            pagination={{
              onChange: (page, pageSize) => {
                setLimit(pageSize);
                getMembers(page, searchKey, pageSize);
              },
              total: total,
              pageSize: limit,
              position: ["bottomCenter"],
              showQuickJumper: true,
            }}
          />
        </div>
  
        <Modal
          title={
            "Updating " +
            member?.member.firstName +
            " " +
            member?.member.middleName +
            " " +
            member?.member.lastName +
            " Information"
          }
          width={"40vw"}
          destroyOnClose={true}
          open={editMemberModal}
          onOk={() => setEditMemberModal(false)}
          onCancel={() => setEditMemberModal(false)}
          footer={[]}
        >
          <EditKikobaMemberInforamtionFormComponent
            member={member}
            onFinish={onFinishEdit}
          />
        </Modal>
      </>
    );
  };
  