/* eslint-disable jsx-a11y/anchor-is-valid */
import {Card, Col, Modal, Row, Statistic} from "antd";
import {useEffect, useState} from "react";
import CountUp from "react-countup";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaContributionData} from "../../interfaces";

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
  <CountUp end={value} separator="," decimalPlaces={2} />
);

interface AnalyticsData {
  total_paid: number;
  total_unpaid: number;
}

interface Props {
  onUpdate?: any;
  isMobile?: boolean;
}

export const ClientChargesDashComponent: React.FC<Props> = (props: Props) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | any>({});
  const [addContributionModalVisible, setAddContributionModalVisible] =
    useState(false);

  const [viewContributionsModalVisible, setViewContributionsModalVisible] =
    useState(false);

  const getAnalytics = async () => {
    const {data} = await simpleRestProvider.custom!<
      KikobaContributionData | any
    >({
      url: configs.apiUrl + `/member/charges/analytics`,
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
          width: props.isMobile ? "100vw" : "50vw",
        }}
        title="Charges/Penalities"
      >
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Total Paid"
                value={analytics.total_paid}
                decimalSeparator="."
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
        title="Add/Pay Contribution"
        width={props.isMobile ? "100vw" : "40vw"}
        open={addContributionModalVisible}
        onOk={() => setAddContributionModalVisible(false)}
        onCancel={() => setAddContributionModalVisible(false)}
        footer={[]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>

      <Modal
        title="Contributions"
        width={props.isMobile ? "100vw" : "40vw"}
        open={viewContributionsModalVisible}
        onOk={() => setViewContributionsModalVisible(false)}
        onCancel={() => setViewContributionsModalVisible(false)}
        footer={[]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};
