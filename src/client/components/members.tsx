/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  OrderedListOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Drawer,
  List,
  Popconfirm,
  Tag,
  Tooltip,
} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData, KikobaMemberData} from "../../interfaces";
import {CreateNewKikobaMemberComponent} from "./form/create_new_kikoba_member_form";
import {KikobaMemberContributionNamesComponent} from "./kikoba_member_contribution_names";

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

export const KikobaMembersComponent: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [members, setMembers] = useState<KikobaMemberData[]>([]);
  const [member, setMember] = useState<KikobaMemberData | any>(null);
  const [createMemberModal, setCreateMemberModal] = useState(false);
  const [memberContributionNames, setMemberContributionNames] =
    useState<boolean>(false);
  let {id} = useParams<{id: string}>();

  const handleMemberContributionNamesModal = (member: KikobaMemberData) => {
    setMember(member);
    setMemberContributionNames(true);
  };

  const getMembers = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<KikobaMemberData | any>({
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
      if (data.data) {
        setTotal(data.pagination.total);
        setPage(data.pagination.page);
        setLimit(data.pagination.limit);
        setMembers(data.data);
      }
    }
    setLoading(false);
  };

  const checkSubscription = async () => {
    await simpleRestProvider.custom!<KikobaMemberData | any>({
      url: configs.apiUrl + `/kikoba/${id}/member/check`,
      method: "get",
    })
      .then((res) => {
        console.log("Subscription");
        console.log(res.data.success);
        setSubscribed(res.data.success);
      })
      .catch((error) => {
        return {data: null};
      });
  };

  const subscribeToKikoba = async () => {
    await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/${id}/subscribe`,
      method: "get",
    })
      .then((res) => {
        setSubscribed(res.data.success);
        onUpdate();
      })
      .catch((error) => {
        return {data: null};
      });
  };

  const onAdd = async () => {
    setCreateMemberModal(false);
    getMembers(1);
    props.onUpdate();
  };

  const onUpdate = async () => {
    checkSubscription();
    getMembers(1);
    props.onUpdate();
  };

  useEffect(() => {
    checkSubscription();
    getMembers(1);
  }, []);

  return (
    <>
      <Card
        title={
          <>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>Members</span>
              <span>
                {!subscribed && (
                  <Popconfirm
                    title="Self Subscription"
                    description="Are you to Self Subscribe?"
                    placement="topRight"
                    onConfirm={subscribeToKikoba}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<PlusOutlined />}>Subscribe</Button>
                  </Popconfirm>
                )}

                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setCreateMemberModal(true)}
                >
                  Add
                </Button>
              </span>
            </div>
          </>
        }
        bodyStyle={{
          paddingTop: 5,
          paddingBottom: 0,
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <div
          style={{
            maxHeight: "66vh",
            minHeight: "66vh",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <List
            bordered
            itemLayout="horizontal"
            dataSource={members}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Tooltip
                    title="Click to View Member Contributions Names"
                    placement="topRight"
                  >
                    <Button
                      icon={<OrderedListOutlined />}
                      size="small"
                      onClick={() => handleMemberContributionNamesModal(item)}
                    ></Button>
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: configs.primaryColor,
                      }}
                    />
                  }
                  title={
                    <a>
                      {item.contributionName ? (
                        <>{item.contributionName}</>
                      ) : (
                        <>
                          {item.member.firstName} {item.member.middleName}{" "}
                          {item.member.lastName}
                          {item.nickname && (
                            <Tag color="green" style={{marginLeft: 5}}>
                              {item.nickname}
                            </Tag>
                          )}
                        </>
                      )}
                    </a>
                  }
                  description=""
                />
              </List.Item>
            )}
          />
        </div>
      </Card>

      <Drawer
        title="Creating/Adding New Member"
        placement="right"
        width={"30vw"}
        destroyOnClose={true}
        onClose={() => {
          setCreateMemberModal(false);
        }}
        open={createMemberModal}
      >
        <CreateNewKikobaMemberComponent kikoba={props.kikoba} onAdd={onAdd} />
      </Drawer>

      <Drawer
        title={
          <>
            {member?.contributionName && (
              <>
                {member?.contributionName}
              </>
            )}
            {!member?.contributionName && (
              <>
                {member?.member.firstName} {member?.member.middleName}{" "}
                {member?.member.lastName}
              </>
            )}

            {member?.nickname && (
              <Tag color="green" style={{marginLeft: 5}}>
                {member?.nickname}
              </Tag>
            )}
            <span style={{marginLeft: 5}}>Contributions Names</span>
          </>
        }
        placement="right"
        width={"30vw"}
        destroyOnClose={true}
        onClose={() => setMemberContributionNames(false)}
        open={memberContributionNames}
      >
        <KikobaMemberContributionNamesComponent
          member={member}
          onUpdate={onUpdate}
        />
      </Drawer>
    </>
  );
};
