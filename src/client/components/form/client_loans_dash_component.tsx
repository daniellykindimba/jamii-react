/* eslint-disable jsx-a11y/anchor-is-valid */
import {OrderedListOutlined, PlusOutlined} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  List,
  Modal,
  Row,
  Statistic,
  Tag,
  Tooltip,
  message,
} from "antd";
import {useEffect, useState} from "react";
import CountUp from "react-countup";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {KikobaContributionData} from "../../../interfaces";
import {ClientLoanApplicationFormComponent} from "../client_loan_application_form_component";

function isFloat(value: number | any) {
  // First, check if the value is a number
  if (typeof value !== "number") {
    return false;
  }

  // Then, check if it is finite (not NaN or Infinity)
  if (!Number.isFinite(value)) {
    return false;
  }

  // Finally, check if it is not an integer
  if (Number.isInteger(value)) {
    return false;
  }

  return true;
}

const formatter = (value: number | any) => (
  <CountUp end={value} separator="," />
);

interface AnalyticsData {
  total_paid: number;
  total_unpaid: number;
}

interface Props {
  onUpdate?: any;
}

export const ClientLoansDashComponent: React.FC<Props> = (props: Props) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | any>({});
  const [loanApplicationModalVisible, setLoanApplicationModalVisible] =
    useState(false);

  const getAnalytics = async () => {
    const {data} = await simpleRestProvider.custom!<
      KikobaContributionData | any
    >({
      url: configs.apiUrl + `/member/loans/analytics`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      setAnalytics(data.data);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  return (
    <>
      <Card
        style={{
          width: "50vw",
        }}
        title={
          <>
            <span>Loans</span>
            <Tooltip title="Apply for Loan">
              <Button
                size="large"
                icon={<PlusOutlined />}
                style={{marginLeft: 10, float: "right"}}
                onClick={() => {
                  setLoanApplicationModalVisible(true);
                }}
                danger
              >
                Apply for Loan
              </Button>
            </Tooltip>
          </>
        }
      >
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Total Paid"
                value={analytics.total_paid}
                formatter={
                  isFloat(analytics.total_paid) ? undefined : formatter
                }
                valueStyle={{
                  color: "#3f8600",
                }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Total Not Paid"
                value={analytics.total_unpaid}
                precision={2}
                formatter={
                  isFloat(analytics.total_unpaid) ? undefined : formatter
                }
                valueStyle={{
                  color: "#cf1322",
                }}
              />
            </Col>
          </Row>
        </div>
      </Card>

      <Modal
        title="Loan Application"
        width={"40vw"}
        open={loanApplicationModalVisible}
        onOk={() => {
          setLoanApplicationModalVisible(false);
        }}
        onCancel={() => {
          setLoanApplicationModalVisible(false);
        }}
        footer={[]}
      >
        <ClientLoanApplicationFormComponent />
      </Modal>
    </>
  );
};
