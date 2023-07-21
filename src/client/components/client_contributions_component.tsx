/* eslint-disable jsx-a11y/anchor-is-valid */
import {Col, Grid, Row} from "antd";
import {useEffect} from "react";
import {ClientLoansDashComponent} from "./form/client_loans_dash_component";
import {ClientContributionsDashComponent} from "./client_contributions_dash_component";
import {ClientChargesDashComponent} from "./client_charges_dash_component";


interface Props {
  onUpdate?: any;
}

export const ClientContributionsComponent: React.FC<Props> = (props: Props) => {
  const breakpoint = Grid.useBreakpoint();
  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;
  useEffect(() => {}, []);

  return (
    <>
      <Row>
        <Col
          span={isMobile ? 24 : 8}
          style={{
            display: "flex",
          }}
        >
          <ClientContributionsDashComponent isMobile={isMobile} />
        </Col>
        <Col
          span={isMobile ? 24 : 8}
          style={{
            display: "flex",
          }}
        >
          <ClientChargesDashComponent isMobile={isMobile} />
        </Col>
        <Col span={isMobile ? 24 : 8} style={{display: "flex"}}>
          <ClientLoansDashComponent isMobile={isMobile} />
        </Col>
      </Row>
    </>
  );
};
