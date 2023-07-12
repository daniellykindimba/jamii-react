/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  ArrowRightOutlined,
} from "@ant-design/icons";
import {Breadcrumb, Tag, message} from "antd";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import { KikobaAnalyticsData, KikobaData } from "../../../interfaces";
import { KikobaAllSharesTransactionsComponent } from "../../components/kikoba_shares_transactions";



interface Props {}

export const KikobaTransactionsView: React.FC<Props> = (props: Props) => {
  const [analytics, setAnalytics] = useState<KikobaAnalyticsData>();
  const [kikoba, setKikoba] = useState<KikobaData>();

  let {id} = useParams<{id: string}>();

  const getKikoba = async () => {
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
  };

  const getKikobaAnalytics = async () => {
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
  };

  const onUpdate = async () => {
    getKikoba();
    getKikobaAnalytics();
  };

  useEffect(() => {
    getKikoba();
    getKikobaAnalytics();
  }, []);

  return (
    <>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link to={"/home"}>Home</Link>,
          },
          {
            title: (
              <Link to={`/vikoba/view/${id}/${kikoba?.registrationNumber}`}>
                Vikoba
                <ArrowRightOutlined style={{marginLeft: 5, marginRight: 5}} />
                <Tag color="green">{kikoba?.registrationNumber}</Tag>
              </Link>
            ),
          },
          {
            title: "Transactions",
          },
        ]}
      />

      <div style={{marginTop: 10}}>
        <KikobaAllSharesTransactionsComponent
          kikoba={kikoba}
          randKey={Math.random()}
          height={"calc(100vh - 0px)"}
        />
      </div>
    </>
  );
};
