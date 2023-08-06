/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  OrderedListOutlined,
  PlusOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Popconfirm,
  Row,
  Statistic,
  Table,
  message,
} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../../../api";
import configs from "../../../../configs";
import {
  DonationData,
  DonationMemberData,
  RegionData,
} from "../../../../interfaces";
import {CreateDonationForm} from "../../../components/form/create_donation_form";
import {EditDonationForm} from "../../../components/form/edit_donation_form";
interface RegionsSearchFormData {
  key: string;
}

interface RegionFormData {
  name: string;
}

interface Props {
  onUpdate?: any;
  donation?: DonationData;
}

export const DonationMembersComponent: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [members, setMembers] = useState<DonationMemberData[]>([]);
  const [member, setMember] = useState<DonationMemberData>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const {push} = useNavigation();
  const [editDonationModal, setEditDonationModal] = useState(false);
  const [searchForm] = Form.useForm<RegionsSearchFormData>();
  const [form] = Form.useForm<RegionFormData>();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  let {id} = useParams<{id: string}>();

  const confirmDelete = async (id: number) => {
    await simpleRestProvider.custom!({
      url: configs.apiUrl + "/donation/" + id + "/delete",
      method: "get",
    })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          if (res.data.success) {
            setMembers(members.filter((member) => member.id !== id));
          }
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const blockDonation = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/donation/block/" + id,
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
      setMembers(
        members.map((member) => {
          if (member.id === id) {
            member.isActive = false;
          }
          return member;
        })
      );
    }
  };

  const unblockDonation = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + "/donation/unblock/" + id,
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
      setMembers(
        members.map((member) => {
          if (member.id === id) {
            member.isActive = true;
          }
          return member;
        })
      );
    }
  };

  const cancelDelete = () => {
    message.info("Canceled");
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "id",
      render: (text: any, row: any, index: any) => (
        <a onClick={() => {}}>
          <span>{row.user.fullName}</span>
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text: any, row: any, index: any) => (
        <a>
          {row?.isActive ? (
            <Popconfirm
              title="Block Donation"
              description="Are you sure to block Donation?"
              onConfirm={() => blockDonation(row?.id)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <span style={{color: "green"}}>Active</span>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Unbock Donation"
              description="Are you sure to Unblock Donation?"
              onConfirm={() => unblockDonation(row?.id)}
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
            title={"Are you sure to delete this Donation?"}
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
            onClick={() => {}}
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
        `/donation/${props.donation?.id}/members?page=${start}&limit=${limit}&q=${key}`,
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

  useEffect(() => {
    getMembers(page, "", 25);
  }, []);

  return (
    <>
      <Card
        title="Members"
        extra={[<Button icon={<PlusOutlined />}>Add Member</Button>]}
      >
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
      </Card>
    </>
  );
};
