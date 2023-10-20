/* eslint-disable jsx-a11y/anchor-is-valid */
import {CloseOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
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
import {KikobaMembersToAddInitialSharesComponent} from "./kikoba_members_to_add_initial_shares";
import {ThousandsFormatterComponent} from "./thousands_formatter";
import {CurrencyFormatter} from "../../components/currency/currency_formatter";
const {Text} = Typography;

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

export const KikobaInitialSharesComponent: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState<KikobaContributionData[]>([]);
  const [addingSharesModalVisible, setAddingSharesModalVisible] =
    useState(false);

  let {id} = useParams<{id: string}>();

  const getShares = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<
      KikobaContributionData | any
    >({
      url:
        configs.apiUrl +
        `/kikoba/${id}/members/shares?page=${start}&limit=${limit}`,
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
    setLoading(false);
  };

  const deleteShare = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/share/${id}/delete`,
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
        message.success(data.data.message);
      } else {
        message.error(data.data.message);
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
              <span>Initial Shares</span>
              <span>
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => setAddingSharesModalVisible(true)}
                >
                  Add
                </Button>
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
            loading={loading}
            renderItem={(item: KikobaContributionData) => {
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
                              {fullName}
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
                      <Tooltip title="Delete/Remove Initial Share">
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
                                  title: fullName,
                                  color: "green",
                                },
                              }}
                              style={{width: 140}}
                            >
                              {fullName}
                            </Text>
                            <Tag
                              style={{marginLeft: 5, fontSize: 12}}
                              color="green"
                            >
                              <CurrencyFormatter
                                amount={item.amount}
                                currency="TZS"
                              />
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
        title="Adding Initial Shares"
        width={"50vw"}
        open={addingSharesModalVisible}
        onOk={() => setAddingSharesModalVisible(false)}
        onCancel={() => setAddingSharesModalVisible(false)}
        footer={[]}
      >
        <KikobaMembersToAddInitialSharesComponent
          kikoba={props.kikoba}
          onUpdate={onUpdate}
        />
      </Modal>
    </>
  );
};
