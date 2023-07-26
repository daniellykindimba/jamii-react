/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  EditOutlined,
  MoneyCollectFilled,
  MoneyCollectOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Grid,
  List,
  Modal,
  Row,
  Spin,
  Statistic,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaAnalyticsData, KikobaData} from "../../interfaces";
import {KikobaInitialSharesComponent} from "../components/initial_shares";
import {KikobaLoansComponent} from "../components/loans";
import {KikobaMembersComponent} from "../components/members";
import {KikobaSharesTransactionsComponent} from "../components/shares_transactions";
import CountUp from "react-countup";
import {UpgradingKikobaAccountComponent} from "../components/upgrading_account";
const {Text} = Typography;

const formatter = (value: number | any) => (
  <CountUp end={value} separator="," />
);

interface Props {}

export const KikobaView: React.FC<Props> = (props: Props) => {
  const [loadingKikoba, setLoadingKikoba] = useState(true);
  const [loading, setLoading] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [updateOperationalModal, setUpdateOperationalModal] = useState(false);
  const [updatingPaymentMode, setUpdatingPaymentMode] = useState(false);
  const [analytics, setAnalytics] = useState<KikobaAnalyticsData>({
    TotalBalance: 0,
    TotalCharges: 0,
    TotalLoans: 0,
    TotalPaidLoans: 0,
    TotalUnpaidLoans: 0,
    TotalMembers: 0,
    TotalNames: 0,
  });
  const [kikoba, setKikoba] = useState<KikobaData>();
  const breakpoint = Grid.useBreakpoint();
  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  let {id} = useParams<{id: string}>();

  const getKikoba = async () => {
    setLoadingKikoba(true);
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${id}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in getting Kikoba");
        return {data: null};
      });
    if (data.data) {
      setKikoba(data.data.data);
    }
    setLoadingKikoba(false);
  };

  const updateKikobaPaymentMode = async (mode: string) => {
    setUpdatingPaymentMode(true);
    let formData = new FormData();
    formData.append("payment_mode", mode);
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + `/kikoba/${id}/payment/mode/update`,
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in updating Kikoba Payment Mode");
        return {data: null};
      });
    if (data.data) {
      getKikoba();
    }
    setUpdatingPaymentMode(false);
  };

  const getKikobaAnalytics = async () => {
    setLoading(true);
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${id}/analytics`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in getting Kikoba Analytics");
        return {data: null};
      });
    if (data.data) {
      setAnalytics(data.data.data);
    }
    setLoading(false);
  };

  const onUpdate = async () => {
    getKikobaAnalytics();
  };

  const getOperationMode = () => {
    return (
      <Tag color="green">
        {kikoba?.paymentMode.replace("_", " ").toUpperCase()}
      </Tag>
    );
  };

  const getPlanType = () => {
    if (kikoba?.planType === "trial") {
      return <Tag color="orange">Trial</Tag>;
    } else if (kikoba?.planType === "premium") {
      return <Tag color="green">Premium</Tag>;
    } else if (kikoba?.planType === "free") {
      return <Tag color="green">Free</Tag>;
    } else {
      return <Tag color="orange">Trial</Tag>;
    }
  };

  const upgradeButton = () => {
    return (
      <Button
        icon={<UploadOutlined />}
        shape="round"
        onClick={() => {
          setUpgradeModal(true);
        }}
      >
        Upgrade Plan
      </Button>
    );
  };

  const updateOperationModeButton = () => {
    return (
      <Button
        icon={<EditOutlined />}
        shape="round"
        onClick={() => {
          setUpdateOperationalModal(true);
        }}
      >
        Update Mode
      </Button>
    );
  };

  const getUpgradePlanButton = () => {
    if (kikoba?.planType === "trial") {
      return upgradeButton();
    } else if (kikoba?.planType === "premium") {
      return upgradeButton();
    } else if (kikoba?.planType === "free") {
      return upgradeButton();
    } else {
      return upgradeButton();
    }
  };

  useEffect(() => {
    getKikoba();
    getKikobaAnalytics();
  }, []);

  return (
    <>
      {isMobile && (
        <>
          <Alert
            description={
              "Please use your Computer for better Performance and Good User Experience"
            }
          />
        </>
      )}
      {!isMobile && (
        <>
          <Row>
            <Col span={14}>
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
                    title: "Kikoba",
                  },
                  {
                    title: (
                      <>
                        <Spin spinning={loadingKikoba}>
                          {" "}
                          {kikoba?.name}{" "}
                          <Tag color="green">{kikoba?.registrationNumber}</Tag>
                        </Spin>
                      </>
                    ),
                  },
                ]}
              />
            </Col>
            <Col span={6} style={{display: "flex", justifyContent: "flex-end"}}>
              <span>
                <Spin spinning={loadingKikoba}>
                  <Text strong>
                    Operating Mode: {getOperationMode()}{" "}
                    {updateOperationModeButton()}
                  </Text>
                </Spin>
              </span>
            </Col>
            <Col span={4} style={{display: "flex", justifyContent: "flex-end"}}>
              <span>
                <Spin spinning={loadingKikoba}>
                  <Text strong>
                    Your Plan: {getPlanType()} {getUpgradePlanButton()}
                  </Text>
                </Spin>
              </span>
            </Col>
          </Row>

          <div style={{marginTop: 10}}>
            <Row gutter={16}>
              <Col span={5}>
                <Card bordered={false}>
                  <Statistic
                    loading={loading}
                    title="Available Balance"
                    value={analytics.TotalBalance}
                    formatter={formatter}
                    precision={2}
                    valueStyle={{color: "#3f8600"}}
                    prefix={<MoneyCollectFilled />}
                  />
                </Card>
              </Col>
              <Col span={5}>
                <Card bordered={false}>
                  <Statistic
                    title="Loans"
                    loading={loading}
                    value={analytics?.TotalLoans}
                    precision={2}
                    formatter={formatter}
                    valueStyle={{color: "#3f8600"}}
                    prefix={<MoneyCollectOutlined />}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card bordered={false}>
                  <Statistic
                    title="Paid Loans"
                    loading={loading}
                    value={analytics?.TotalPaidLoans}
                    precision={2}
                    formatter={formatter}
                    valueStyle={{color: "#3f8600"}}
                    prefix={<MoneyCollectFilled />}
                  />
                </Card>
              </Col>
              <Col span={3}>
                <Card bordered={false}>
                  <Statistic
                    title="Not Paid Loans"
                    loading={loading}
                    value={analytics?.TotalUnpaidLoans}
                    precision={2}
                    formatter={formatter}
                    valueStyle={{color: "#3f8600"}}
                    prefix={<MoneyCollectOutlined />}
                  />
                </Card>
              </Col>
              <Col span={3}>
                <Card bordered={false}>
                  <Statistic
                    title="Charges/Penalties"
                    loading={loading}
                    value={analytics?.TotalCharges}
                    precision={2}
                    formatter={formatter}
                    valueStyle={{color: "#3f8600"}}
                    prefix={<MoneyCollectFilled />}
                  />
                </Card>
              </Col>
              <Col span={2}>
                <Card bordered={false}>
                  <Statistic
                    title="Members"
                    loading={loading}
                    value={analytics?.TotalMembers}
                    precision={0}
                    formatter={formatter}
                    valueStyle={{color: "#3f8600"}}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>

              <Col span={2}>
                <Card bordered={false}>
                  <Statistic
                    title="Names"
                    loading={loading}
                    value={analytics?.TotalNames}
                    precision={0}
                    formatter={formatter}
                    valueStyle={{color: "#3f8600"}}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          <div style={{marginTop: 10}}>
            <Row>
              <Col span={6}>
                <KikobaSharesTransactionsComponent
                  kikoba={kikoba}
                  onUpdate={onUpdate}
                />
              </Col>
              <Col span={6}>
                <KikobaLoansComponent kikoba={kikoba} onUpdate={onUpdate} />
              </Col>
              <Col span={6}>
                <KikobaInitialSharesComponent
                  kikoba={kikoba}
                  onUpdate={onUpdate}
                />
              </Col>
              <Col span={6}>
                <KikobaMembersComponent kikoba={kikoba} onUpdate={onUpdate} />
              </Col>
            </Row>
          </div>

          <Modal
            title="Upgrading Plan"
            open={upgradeModal}
            destroyOnClose={true}
            width={"30vw"}
            footer={[]}
            onOk={() => {}}
            onCancel={() => setUpgradeModal(false)}
          >
            <UpgradingKikobaAccountComponent
              kikoba={kikoba}
              onUpdate={() => {}}
            />
          </Modal>

          <Modal
            title="Updating Operation Mode"
            open={updateOperationalModal}
            destroyOnClose={true}
            width={"60vw"}
            footer={[]}
            onOk={() => {}}
            onCancel={() => setUpdateOperationalModal(false)}
          >
            <div style={{maxHeight: "75vh", overflowY: "auto"}}>
              <Spin spinning={updatingPaymentMode}>
                <Row>
                  <Col span={24}>
                    <Card
                      title={
                        <>
                          <Row>
                            <Col
                              span={24}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>FULL DIGITAL</span>
                              <Switch
                                disabled={
                                  kikoba?.paymentMode === "full_digital"
                                }
                                defaultChecked
                                checked={kikoba?.paymentMode === "full_digital"}
                                onChange={(e) => {
                                  if (e) {
                                    updateKikobaPaymentMode("full_digital");
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </>
                      }
                      bordered={true}
                    >
                      <List
                        bordered
                        dataSource={[
                          "All Payments  will done online",
                          "All Payouts/Withdrawals will be done online",
                          "All Loans will be disbursed online",
                          "All Charges/Penalties will be done online",
                          "All Shares will be Paid online",
                        ]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                      />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card
                      title={
                        <>
                          <Row>
                            <Col
                              span={24}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>SEMI DIGITAL</span>
                              <Switch
                                disabled={
                                  kikoba?.paymentMode === "semi_digital"
                                }
                                defaultChecked
                                checked={kikoba?.paymentMode === "semi_digital"}
                                onChange={(e) => {
                                  if (e) {
                                    updateKikobaPaymentMode("semi_digital");
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </>
                      }
                      bordered={true}
                    >
                      <List
                        bordered
                        dataSource={[
                          "All Payments  will done Online and Manual/Data Entry",
                          "All Payouts/Withdrawals will be done Online and Manual/Data Entry",
                          "All Loans will be disbursed Online and Manual/Data Entry",
                          "All Charges/Penalties will be done Online and Manual/Data Entry",
                          "All Shares will be Paid Online and Manual/Data Entry",
                        ]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                      />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card
                      title={
                        <>
                          <Row>
                            <Col
                              span={24}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>MANUAL</span>
                              <Switch
                                disabled={kikoba?.paymentMode === "manual"}
                                defaultChecked
                                checked={kikoba?.paymentMode === "manual"}
                                onChange={(e) => {
                                  if (e) {
                                    updateKikobaPaymentMode("manual");
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </>
                      }
                      bordered={true}
                    >
                      <List
                        bordered
                        dataSource={[
                          "All Payments  will done Manual/Data Entry",
                          "All Payouts/Withdrawals will be done Manual/Data Entry",
                          "All Loans will be disbursed Manual/Data Entry",
                          "All Charges/Penalties will be done Manual/Data Entry",
                          "All Shares will be Paid Manual/Data Entry",
                        ]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                      />
                    </Card>
                  </Col>
                </Row>
              </Spin>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
