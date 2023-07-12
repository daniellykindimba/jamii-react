/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  AlertOutlined,
  OrderedListOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  List,
  Modal,
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
import {KikobaData, KikobaLoanData} from "../../interfaces";
import {KikobaLoanApplicationForm} from "./form/kikoba_loan_application_form";
import {LoansRequestsComponent} from "./loans_requests";
import {LoanRepaymentsComponent} from "./loan_repayments";
import {ThousandsFormatterComponent} from "./thousands_formatter";

const {Text} = Typography;

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

export const KikobaLoansComponent: React.FC<Props> = (props: Props) => {
  const [loan, setLoan] = useState<KikobaLoanData>();
  const [loans, setLoans] = useState<KikobaLoanData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [searchKey, setSearchKey] = useState<string>("");
  const [approver, setApprover] = useState<Boolean>(false);
  const [requestData, setRequestData] = useState<number>(0);
  const [loansRequestsModal, setLoansRequestsModal] = useState(false);
  const [addingLoanModalVisible, setAddingLoanModalVisible] = useState(false);
  const [repaymentsModal, setRepaymentsModal] = useState(false);
  let {id} = useParams<{id: string}>();

  const getLoans = async () => {
    await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${id}/loans`,
    })
      .then((res) => {
        setLoans(res.data.data);
        setPage(res.data.pagination.page);
        setLimit(res.data.pagination.limit);
        setTotal(res.data.pagination.total);
      })
      .catch(() => {
        return {data: null};
      });
  };

  const checkIfLoanApprover = async () => {
    await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${id}/loan/approver/check`,
    })
      .then((res) => {
        setApprover(res.data.success);
      })
      .catch(() => {
        return {data: null};
      });
  };

  const getKikobaLoansRequestsTotal = async () => {
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${id}/loan/requests/total`,
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        message.error("Error in getting Kikoba Loan Requests Total");
        return {data: null};
      });

    if (data.data) {
      setRequestData(data.data.data);
    }
  };

  const onFinish = () => {
    setAddingLoanModalVisible(false);
    props.onUpdate();
  };

  const handleLoanRepaymentModal = async (loan: KikobaLoanData) => {
    setLoan(loan);
    setRepaymentsModal(true);
  };

  const onUpdate = async () => {
    checkIfLoanApprover();
    getKikobaLoansRequestsTotal();
    getLoans();
    props.onUpdate();
  };

  useEffect(() => {
    checkIfLoanApprover();
    getKikobaLoansRequestsTotal();
    getLoans();
  }, [props.kikoba]);

  return (
    <>
      <Card
        title={
          <>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>Loans</span>
              <span style={{marginRight: 13}}>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setAddingLoanModalVisible(true)}
                >
                  Apply
                </Button>
                {approver && (
                  <Badge count={requestData} offset={[1, 10]}>
                    <Button
                      icon={<AlertOutlined />}
                      onClick={() => setLoansRequestsModal(true)}
                      disabled={requestData === 0}
                    >
                      Requests
                    </Button>
                  </Badge>
                )}
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
            dataSource={loans}
            renderItem={(item) => {
              var fullName = `${item.kikobaMember.member.firstName} ${item.kikobaMember.member.middleName} ${item.kikobaMember.member.lastName}`;
              return (
                <List.Item
                  actions={[
                    <Tooltip title="View/Manager Loan Repayments">
                      <Button
                        style={{float: "right"}}
                        icon={<OrderedListOutlined />}
                        size="small"
                        onClick={() => {
                          handleLoanRepaymentModal(item);
                        }}
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
                            <Tooltip title="Total Amount of Loan">
                              <Tag
                                style={{marginLeft: 5, fontSize: 12}}
                                color="green"
                              >
                                <ThousandsFormatterComponent
                                  amount={item.amount}
                                />
                              </Tag>
                            </Tooltip>
                            <KikobaMemberLoanRepaymentTotal
                              loanRequestId={item.id}
                              randKey={Math.random()}
                            />
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
        title="Loans Requests"
        width={"40vw"}
        open={loansRequestsModal}
        footer={[]}
        onOk={() => setLoansRequestsModal(false)}
        onCancel={() => setLoansRequestsModal(false)}
      >
        <LoansRequestsComponent kikoba={props.kikoba} onUpdate={onUpdate} />
      </Modal>

      <Modal
        title="Application for Loan"
        width={"25vw"}
        destroyOnClose={true}
        open={addingLoanModalVisible}
        onOk={() => setAddingLoanModalVisible(false)}
        onCancel={() => setAddingLoanModalVisible(false)}
        footer={[]}
      >
        <KikobaLoanApplicationForm kikoba={id} onFinish={onFinish} />
      </Modal>

      <Modal
        title={
          <span style={{fontSize: 18}}>
            {loan?.kikobaMember.member.firstName}{" "}
            {loan?.kikobaMember.member.middleName}{" "}
            {loan?.kikobaMember.member.lastName}
            <Tag color="green" style={{marginLeft: 5, marginRight: 5}}>
              <ThousandsFormatterComponent amount={loan?.amount} />
            </Tag>
            Loan Repayments
          </span>
        }
        open={repaymentsModal}
        destroyOnClose={true}
        width={"40vw"}
        onOk={() => {
          setRepaymentsModal(false);
        }}
        onCancel={() => {
          setRepaymentsModal(false);
        }}
        footer={[]}
      >
        <LoanRepaymentsComponent loan={loan} onUpdate={onUpdate} />
      </Modal>
    </>
  );
};

interface RepaymentProps {
  loanRequestId: number;
  randKey?: any;
}

const KikobaMemberLoanRepaymentTotal: React.FC<RepaymentProps> = (
  props: RepaymentProps
) => {
  const [amount, setAmount] = useState<number>(0);

  const getRepaymentAmount = async () => {
    await simpleRestProvider.custom!({
      method: "get",
      url:
        configs.apiUrl +
        `/kikoba/member/loan/${props.loanRequestId}/repayment/total`,
    })
      .then((res) => {
        setAmount(res.data.data.amount);
      })
      .catch(() => {
        return {data: null};
      });
  };

  useEffect(() => {
    getRepaymentAmount();
  }, [props.loanRequestId, props.randKey]);

  return (
    <>
      <Tooltip title="Total Amount of Loan Paid">
        <Tag style={{marginLeft: 5, fontSize: 12}} color="red">
          <ThousandsFormatterComponent amount={amount} />
        </Tag>
      </Tooltip>
    </>
  );
};
