/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Col,
  Row,
} from "antd";
import {useEffect} from "react";
import CountUp from "react-countup";
import {ClientLoansDashComponent} from "./form/client_loans_dash_component";
import {ClientContributionsDashComponent} from "./client_contributions_dash_component";
import {ClientChargesDashComponent} from "./client_charges_dash_component";

const formatter = (value: number | any) => (
  <CountUp end={value} separator="," />
);

interface Props {
  onUpdate?: any;
}

export const ClientContributionsComponent: React.FC<Props> = (props: Props) => {
  useEffect(() => {}, []);

  return (
    <>
      <Row>
        <Col
          span={8}
          style={{
            display: "flex",
          }}
        >
          <ClientContributionsDashComponent />
        </Col>
        <Col
          span={8}
          style={{
            display: "flex",
          }}
        >
          <ClientChargesDashComponent />
        </Col>
        <Col span={8} style={{display: "flex"}}>
          <ClientLoansDashComponent />
        </Col>
      </Row>
    </>
  );
};
