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
} from "antd";
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
  <CountUp end={value} separator="," />
);

interface AnalyticsData {
  total_paid: number;
  total_unpaid: number;
}

interface Props {
  onUpdate?: any;
}

export const ClientContributionsDashComponent: React.FC<Props> = (
  props: Props
) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | any>({});

  const getAnalytics = async () => {
    const {data} = await simpleRestProvider.custom!<
      KikobaContributionData | any
    >({
      url: configs.apiUrl + `/member/contributions/analytics`,
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
        title="Contributions"
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
          </Row>
        </div>
      </Card>
    </>
  );
};
