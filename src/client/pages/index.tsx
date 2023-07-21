import {useEffect, useState} from "react";
import {ClientPaymentsComponent} from "../components/client_payments_component";
import {ClientContributionsComponent} from "../components/client_contributions_component";
import {Button, Card, Col, Drawer, Grid, Row, Table} from "antd";
import {UserContributionsComponent} from "../components/user_contributions";
import {UserLoanRepaymentsComponent} from "../components/user_loan_repayments_component";
import {OrderedListOutlined} from "@ant-design/icons";

interface Props {}

export const ClientHome: React.FC<Props> = (props: Props) => {
  const [openContributionsModal, setOpenContributionsModal] = useState(false);
  const [openLoanRepaymentsModal, setOpenLoanRepaymentsModal] = useState(false);
  const breakpoint = Grid.useBreakpoint();
  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  useEffect(() => {}, []);

  return (
    <>
      <div className="container-fluid">
        <ClientPaymentsComponent />
      </div>

      <div
        style={{
          marginTop: 10,
        }}
      >
        <ClientContributionsComponent />
      </div>

      <Row>
        <Col span={isMobile ? 24 : 12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Recently Contributions</span>
                <Button
                  icon={<OrderedListOutlined />}
                  onClick={() => setOpenContributionsModal(true)}
                ></Button>
              </div>
            }
            bodyStyle={{
              padding: 0,
            }}
          >
            <div>
              <UserContributionsComponent min={true} limit={5} />
            </div>
          </Card>
        </Col>

        <Col span={isMobile ? 24 : 12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Recently Loans Repayments</span>
                <Button
                  icon={<OrderedListOutlined />}
                  onClick={() => setOpenLoanRepaymentsModal(true)}
                ></Button>
              </div>
            }
            bodyStyle={{
              padding: 0,
            }}
          >
            <div>
              <UserLoanRepaymentsComponent min={true} limit={5} />
            </div>
          </Card>
        </Col>
      </Row>

      <Drawer
        title="Contributions"
        placement="right"
        destroyOnClose={true}
        width={isMobile ? "100vw" : "80vw"}
        onClose={() => {
          setOpenContributionsModal(false);
        }}
        open={openContributionsModal}
      >
        <UserContributionsComponent />
      </Drawer>

      <Drawer
        title="Loans Repayments"
        placement="right"
        destroyOnClose={true}
        width={isMobile ? "100vw" : "80vw"}
        onClose={() => {
          setOpenLoanRepaymentsModal(false);
        }}
        open={openLoanRepaymentsModal}
      >
        <UserLoanRepaymentsComponent />
      </Drawer>
    </>
  );
};
