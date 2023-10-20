/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  OrderedListOutlined,
  PlusOutlined,
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
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {DonationData, RegionData} from "../../../interfaces";
import {CreateDonationForm} from "../../components/form/create_donation_form";
import moment from "moment";
import {EditDonationForm} from "../../components/form/edit_donation_form";
import {DonationDashboard} from "./doantion_dashboard";
import {CurrencyFormatter} from "../../../components/currency/currency_formatter";

interface RegionsSearchFormData {
  key: string;
}

interface RegionFormData {
  name: string;
}

interface Props {
  onUpdate?: any;
}

export const DonationsPage: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [donation, setDonation] = useState<DonationData>();
  const [donations, setDonations] = useState<DonationData[]>([]);
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

  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [manageModal, setManageModal] = useState(false);

  const handleManageDonation = (donation: DonationData) => {
    setDonation(donation);
    setManageModal(true);
  };

  const showEditDonationModal = (donation: DonationData) => {
    setDonation(donation);
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

  const confirmDelete = async (id: number) => {
    await simpleRestProvider.custom!({
      url: configs.apiUrl + "/donation/" + id + "/delete",
      method: "get",
    })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          if (res.data.success) {
            setDonations(donations.filter((donation) => donation.id !== id));
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
      setDonations(
        donations.map((donation) => {
          if (donation.id === id) {
            donation.isActive = false;
          }
          return donation;
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
      setDonations(
        donations.map((donation) => {
          if (donation.id === id) {
            donation.isActive = true;
          }
          return donation;
        })
      );
    }
  };

  const cancelDelete = () => {
    message.info("Canceled");
  };

  const columns = [
    {
      title: "Donation#",
      dataIndex: "id",
      render: (text: any, row: DonationData, index: any) => (
        <a onClick={() => handleManageDonation(row)}>
          <span>{row.donationNumber}</span>
        </a>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (text: any, row: DonationData, index: any) => (
        <span>{row.title}</span>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      render: (text: any, row: DonationData, index: any) => (
        <span>{moment(row.deadline).format("MMMM Do YYYY, h:mm:ss a")}</span>
      ),
    },
    {
      title: "Goal Amount",
      dataIndex: "goalAmount",
      render: (text: any, row: DonationData, index: any) => (
        <span>
          <CurrencyFormatter currency="TZS" amount={row.totalAmount} />
        </span>
      ),
    },
    {
      title: "Donated Amount",
      dataIndex: "donatedAmount",
      render: (text: any, row: DonationData, index: any) => (
        <span>
          <CurrencyFormatter currency="TZS" amount={row.totalDonations} />
        </span>
      ),
    },
    {
      title: "Total Donars",
      dataIndex: "totalDonators",
      render: (text: any, row: DonationData, index: any) => (
        <span>{row.totalDonators}</span>
      ),
    },
    {
      title: "Public",
      dataIndex: "public",
      render: (text: any, row: DonationData, index: any) => (
        <span>{row.isPublic ? "Yes" : "No"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text: any, row: DonationData, index: any) => (
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
            disabled={row?.user?.id !== user?.id}
          >
            <Button
              disabled={row?.user?.id !== user?.id}
              type="primary"
              icon={<DeleteOutlined />}
              style={{marginRight: 3}}
            ></Button>
          </Popconfirm>

          <Button
            disabled={row?.user?.id !== user?.id}
            type="primary"
            onClick={() => handleEditDonation(row)}
            icon={<EditOutlined />}
          ></Button>
        </div>
      ),
    },
  ];

  const getDonations = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url: configs.apiUrl + `/donations?page=${start}&limit=${limit}&q=${key}`,
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
      setDonations(data.data);
    }
    setLoading(false);
  };

  const handleEditDonation = async (donation: DonationData) => {
    setDonation(donation);
    setEditDonationModal(true);
  };

  const onCreateFinish = async (donation: DonationData) => {
    setDonations([donation, ...donations]);
    setCreateModal(false);
  };

  const onFinishEdit = async (doantion: DonationData) => {
    setEditDonationModal(false);
    setDonations(
      donations.map((d) => {
        if (d.id === doantion.id) {
          d = doantion;
        }
        return d;
      })
    );
  };

  useEffect(() => {
    getDonations(page, "", 25);
  }, []);

  return (
    <>
      <Row style={{marginTop: 10}}>
        <Col span={isMobile ? 24 : 8}>
          <Form<RegionsSearchFormData>
            layout="vertical"
            form={searchForm}
            onFinish={(values) => {
              setPage(1);
              donations.length = 0;
              getDonations(1, values.key, limit);
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
          span={isMobile ? 24 : 16}
          style={{display: "flex", justifyContent: "flex-end"}}
        >
          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            onClick={() => setCreateModal(true)}
          >
            Create Donation
          </Button>
          {/* <Button
            icon={<OrderedListOutlined />}
            type="primary"
            size="large"
            onClick={() => {}}
          >
            View Public Donations
          </Button> */}
        </Col>
      </Row>

      <div>
        <Table
          size="small"
          loading={loading}
          columns={columns}
          dataSource={donations}
          scroll={{x: true}}
          pagination={{
            onChange: (page, pageSize) => {
              setLimit(pageSize);
              getDonations(page, searchKey, pageSize);
            },
            total: total,
            pageSize: limit,
            position: ["bottomCenter"],
            showQuickJumper: true,
          }}
        />
      </div>

      <Modal
        title={"Updating " + donation?.title}
        width={"40vw"}
        destroyOnClose={true}
        open={editDonationModal}
        onOk={() => setEditDonationModal(false)}
        onCancel={() => setEditDonationModal(false)}
        footer={[]}
      >
        <EditDonationForm donation={donation} onFinish={onFinishEdit} />
      </Modal>

      <Modal
        title="Create Donation"
        width={"40vw"}
        destroyOnClose={true}
        open={createModal}
        onOk={() => setCreateModal(false)}
        onCancel={() => setCreateModal(false)}
        footer={[]}
        bodyStyle={{
          maxHeight: "80vh",
          overflowY: "scroll",
          padding: 10,
        }}
      >
        <CreateDonationForm onFinish={onCreateFinish} />
      </Modal>

      <Modal
        title={"Manage " + donation?.title + " #" + donation?.donationNumber}
        width={"90vw"}
        destroyOnClose={true}
        open={manageModal}
        onOk={() => setManageModal(false)}
        onCancel={() => setManageModal(false)}
        footer={[]}
        bodyStyle={{
          maxHeight: "90vh",
          overflowY: "scroll",
          padding: 10,
        }}
        // make modal full height of the screen
        style={{top: 5, bottom: 0}}
      >
        <DonationDashboard donation={donation} onUpdate={() => {}} />
      </Modal>
    </>
  );
};
