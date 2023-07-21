/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  CalendarOutlined,
  CloseOutlined,
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
  Modal,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import moment from "moment";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData, KikobaContributionData} from "../../interfaces";
import {KikobaContributionsDraftComponent} from "./kikoba_contributions_draft";
import {KikobaMembersToAddSharesComponent} from "./kikoba_members_to_add_contributions";
import {KikobaAllSharesTransactionsComponent} from "./kikoba_shares_transactions";

const {Text} = Typography;

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

export const KikobaSharesTransactionsComponent: React.FC<Props> = (
  props: Props
) => {
  const [shares, setShares] = useState<KikobaContributionData[]>([]);
  const [addingSharesModalVisible, setAddingSharesModalVisible] =
    useState(false);
  const [transactionsDraft, setTransactionsDraft] = useState(false);
  const [viewAllTransactionsModal, setViewAllTransactionsModal] =
    useState(false);

  let {id} = useParams<{id: string}>();

  const getShares = async (
    start: number,
    key: string = "",
    limit: number = 10
  ) => {
    const {data} = await simpleRestProvider.custom!<
      KikobaContributionData | any
    >({
      url:
        configs.apiUrl +
        `/kikoba/${id}/members/contributions?page=${start}&limit=${limit}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      if (data.success) {
        if (data.data) {
          setShares(data.data);
        }
      }
    }
  };

  const deleteShare = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/contribution/${id}/delete`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      if (data.success) {
        getShares(1);
        props.onUpdate();
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    }
  };

  const onUpdate = () => {
    getShares(1);
    props.onUpdate();
  };

  useEffect(() => {
    getShares(1);
  }, []);

  return (
    <>
      <Card
        title={
          <>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>Shares Transactions</span>
              <span>
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => setAddingSharesModalVisible(true)}
                >
                  Add
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  size="small"
                  onClick={() => setTransactionsDraft(true)}
                >
                  Draft
                </Button>
                <Tooltip title="View All">
                  <Button
                    icon={<OrderedListOutlined />}
                    size="small"
                    onClick={() => {
                      setViewAllTransactionsModal(true);
                    }}
                  ></Button>
                </Tooltip>
              </span>
            </div>
          </>
        }
        bodyStyle={{
          padding: "5px 2px 0px 2px",
        }}
      >
        <div
          style={{
            maxHeight: "66vh",
            minHeight: "66vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <List
            bordered
            itemLayout="horizontal"
            dataSource={shares}
            renderItem={(item) => {
              var fullName = `${item.kikobaMember.member.firstName} ${item.kikobaMember.member.middleName} ${item.kikobaMember.member.lastName}`;
              return (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="Remove Share Contribution"
                      style={{width: 300}}
                      description={
                        <>
                          <p>Are you sure to Remove Share Contribution for</p>
                          <p>
                            <span style={{fontWeight: "bolder", marginLeft: 5}}>
                              {item.kikobaMember.contributionName
                                ? item.kikobaMember.contributionName
                                : fullName}
                            </span>
                            ?
                          </p>
                        </>
                      }
                      onConfirm={() => {
                        deleteShare(item.id);
                      }}
                      onCancel={() => {}}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip title="Delete/Remove Contribution">
                        <Button
                          style={{float: "right"}}
                          icon={<CloseOutlined />}
                          size="small"
                        ></Button>
                      </Tooltip>
                    </Popconfirm>,
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
                      <>
                        <span style={{display: "block"}}>
                          <a>
                            <Text
                              ellipsis={{
                                tooltip: {
                                  placement: "topLeft",
                                  title: item.kikobaMember.contributionName
                                    ? item.kikobaMember.contributionName
                                    : fullName,
                                  color: "green",
                                },
                              }}
                              style={{width: 140}}
                            >
                              {item.kikobaMember.contributionName
                                ? item.kikobaMember.contributionName
                                : fullName}
                            </Text>
                            <Tag
                              style={{marginLeft: 5, fontSize: 12}}
                              color="green"
                            >
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "TZS",
                              })
                                .formatToParts(item.amount)
                                .map((p) =>
                                  p.type !== "literal" && p.type !== "currency"
                                    ? p.value
                                    : ""
                                )
                                .join("")}
                            </Tag>
                          </a>
                        </span>
                        <span style={{display: "block", fontWeight: "bolder"}}>
                          Posted{" "}
                          <Tooltip title={moment(item.createdAt).format("LLL")}>
                            {moment(item.createdAt).fromNow()}
                          </Tooltip>
                        </span>
                      </>
                    }
                    description=""
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </Card>

      <Modal
        title="Adding Shares/Contributions"
        width={"50vw"}
        open={addingSharesModalVisible}
        onOk={() => setAddingSharesModalVisible(false)}
        onCancel={() => setAddingSharesModalVisible(false)}
        footer={[]}
      >
        <KikobaMembersToAddSharesComponent
          kikoba={props.kikoba}
          onUpdate={onUpdate}
        />
      </Modal>

      <Drawer
        title={
          <>
            <span>Shares/Contributions Draft</span>
            <Button
              icon={<CloseOutlined />}
              style={{
                float: "right",
              }}
              onClick={() => setTransactionsDraft(false)}
            ></Button>
          </>
        }
        closeIcon={null}
        maskClosable={true}
        width={"90vw"}
        destroyOnClose={true}
        keyboard={true}
        placement="left"
        open={transactionsDraft}
        onClose={() => setTransactionsDraft(false)}
        footer={[]}
        bodyStyle={{
          padding: 0,
          margin: 0,
        }}
      >
        <KikobaContributionsDraftComponent
          kikoba={props.kikoba}
          randKey={Math.random()}
        />
      </Drawer>

      <Modal
        title="All Shares/Contributions"
        width={"80vw"}
        open={viewAllTransactionsModal}
        destroyOnClose={true}
        onOk={() => setViewAllTransactionsModal(false)}
        onCancel={() => setViewAllTransactionsModal(false)}
        footer={[]}
      >
        <KikobaAllSharesTransactionsComponent
          kikoba={props.kikoba}
          randKey={Math.random()}
          onUpdate={onUpdate}
        />
      </Modal>
    </>
  );
};
