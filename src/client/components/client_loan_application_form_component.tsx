/* eslint-disable jsx-a11y/anchor-is-valid */
import {Button, Card, Col, List, Modal, Row, Statistic, Typography} from "antd";
import {useEffect, useState} from "react";
import CountUp from "react-countup";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {
  KikobaContributionData,
  KikobaData,
  KikobaMemberData,
} from "../../interfaces";
import {PlusOutlined} from "@ant-design/icons";
import {ClientKikobaNamesComponent} from "./client_payments_adding_component";

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

interface Props {
  onUpdate?: any;
}

export const ClientLoanApplicationFormComponent: React.FC<Props> = (
  props: Props
) => {
  const [kikobas, setKikobas] = useState<KikobaData[]>([]);

  const getKikobas = async () => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikobas/me`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      setKikobas(data.data);
    }
  };

  useEffect(() => {
    getKikobas();
  }, []);

  return (
    <>
      <div
        style={{
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
      >
        <List
          bordered
          dataSource={kikobas}
          renderItem={(kikoba: KikobaData) => (
            <List.Item actions={[]}>
              {kikoba.name}

              <div style={{marginTop: 10}}>
                <ClientKikobaNamesComponent
                  kikoba={kikoba}
                  loanApplication={true}
                  onUpdate={() => {}}
                />
              </div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
