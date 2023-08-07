/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Form,
  Grid,
  List,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
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
import {AddingDonationMemberForm} from "./form/adding_donation_member_form";
import InfiniteScroll from "react-infinite-scroll-component";
import {AddingMemberDonationForm} from "./form/adding_member_donation_form";
interface RegionsSearchFormData {
  key: string;
}

interface RegionFormData {
  name: string;
}

interface Props {
  randKey?: any;
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
  const [addDonationMemberModal, setAddDonationMemberModal] = useState(false);
  const [searchForm] = Form.useForm<RegionsSearchFormData>();
  const [form] = Form.useForm<RegionFormData>();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;
  const [addDonationModal, setAddDonationModal] = useState(false);

  let {id} = useParams<{id: string}>();

  const handleAddDonationModal = async (member: DonationMemberData) => {
    setMember(member);
    setAddDonationModal(true);
  };

  const confirmDelete = async (id: number) => {
    await simpleRestProvider.custom!({
      url: configs.apiUrl + `/donation/member/${id}/delete`,
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

  const handleUpdate = () => {
    getMembers(page, searchKey, limit);
  };

  const handleDonationAdd = () => {
    setAddDonationModal(false);
    props.onUpdate();
  };

  useEffect(() => {
    getMembers(page, "", 25);
  }, [props.randKey]);

  return (
    <>
      <Card
        title="Members"
        extra={[
          <Button
            icon={<PlusOutlined />}
            onClick={() => setAddDonationMemberModal(true)}
          >
            Add Member
          </Button>,
        ]}
      >
        <InfiniteScroll
          dataLength={total}
          next={() => getMembers(page + 1, searchKey, limit)}
          hasMore={total > members.length}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{textAlign: "center"}}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          // below props only if you need pull down functionality
          refreshFunction={() => getMembers(1, searchKey, limit)}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
        >
          <List
            dataSource={members}
            renderItem={(member) => (
              <List.Item
                key={member.user.phone}
                extra={[
                  <Tooltip title="Add Donation">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      style={{marginRight: 3}}
                      onClick={() => handleAddDonationModal(member)}
                    ></Button>
                  </Tooltip>,
                  <Popconfirm
                    title={"Are you sure to delete this Member?"}
                    onConfirm={() => confirmDelete(member?.id)}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      icon={<DeleteOutlined />}
                      style={{marginRight: 3}}
                    ></Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <a>
                      {member.user.fullName}

                      <Tag color="green" style={{marginLeft: 5}}>
                        {member.totalDonations.toLocaleString("en-US", {
                          style: "currency",
                          currency: "TZS",
                        })}
                      </Tag>
                    </a>
                  }
                  description={member.user.phone}
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </Card>

      <Modal
        title={"Add " + props.donation?.title + " Member"}
        open={addDonationMemberModal}
        destroyOnClose={true}
        width={"30vw"}
        onOk={() => setAddDonationMemberModal(false)}
        onCancel={() => setAddDonationMemberModal(false)}
        footer={[]}
      >
        <AddingDonationMemberForm
          donation={props.donation}
          onUpdate={handleUpdate}
        />
      </Modal>

      <Modal
        title={"Add Donation for " + member?.user.fullName}
        open={addDonationModal}
        destroyOnClose={true}
        width={"30vw"}
        onOk={() => setAddDonationModal(false)}
        onCancel={() => setAddDonationModal(false)}
        footer={[]}
      >
        <AddingMemberDonationForm
          member={member}
          onUpdate={handleDonationAdd}
        />
      </Modal>
    </>
  );
};
