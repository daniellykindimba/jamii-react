import {useActiveAuthProvider, useGetIdentity} from "@refinedev/core";
import {useEffect, useState} from "react";
import {WeeklyPaymentsDash} from "../components/dash/weekly_payments";
import {Card, Col, Row, Statistic} from "antd";
import {ArrowUpOutlined} from "@ant-design/icons";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {RegionData} from "../../interfaces";
import { WeeklyVikobaTransactionsDash } from "../components/dash/vikoba_transactions";

interface AnalyticsData {
  totalUsers: number;
  totalVikoba: number;
  totalVikobaMembers: number;
}

interface Props {}

export const ControlHome: React.FC<Props> = (props: Props) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalVikoba: 0,
    totalVikobaMembers: 0,
  });

  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const getAnalytics = async () => {
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url: configs.apiUrl + `/dashboard/analytics`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });
    if (data) {
      setAnalytics(data.data);
    }
  };

  useEffect(() => {
    if ((user?.isAdmin || user?.isStaff) === false) {
      window.location.href = "/";
    }
    getAnalytics();
  }, []);

  return (
    <>
      <Row>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Total Users"
              value={analytics.totalUsers}
              precision={0}
              valueStyle={{color: "#3f8600"}}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Total Vikoba"
              value={analytics.totalVikoba}
              precision={0}
              valueStyle={{color: "#3f8600"}}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Total Vikoba Members"
              value={analytics.totalVikobaMembers}
              precision={0}
              valueStyle={{color: "#3f8600"}}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Card title="Weekly Service Payments">
            <WeeklyPaymentsDash />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Weekly Vikoba Payments Collections">
            <WeeklyVikobaTransactionsDash />
          </Card>
        </Col>
      </Row>
    </>
  );
};