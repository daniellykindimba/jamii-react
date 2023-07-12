// import {Column} from "@ant-design/charts";
import {useEffect, useState} from "react";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";

interface AnalyticsData {
  day: string;
  total: number;
}

interface Props {}

export const WeeklyVikobaTransactionsDash: React.FC<Props> = (props: Props) => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);

  const config = {
    data: analytics,
    xField: "day",
    yField: "total",
    columnWidthRatio: 0.8,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Day of Week",
      },
      sales: {
        alias: "Total Payments",
      },
    },
  };

  const getData = async () => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/weekly/vikoba/contributions/analytics`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });
    console.log(data);
    if (data) {
      setAnalytics(data.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {/* <Column {...config} /> */}
    </>
  );
};
