/* eslint-disable jsx-a11y/anchor-is-valid */
import {Button, Card, Col, Grid, Modal, Row, message} from "antd";
import {useEffect, useState} from "react";
import {ClientPaymentsAddingComponent} from "./client_payments_adding_component";
import {ClientLoanPaymentComponent} from "./client_loans_payment";
import {PayCircleFilled} from "@ant-design/icons";

interface Props {
  onUpdate?: any;
}

export const ClientPaymentsComponent: React.FC<Props> = (props: Props) => {
  const [contributionModal, setContributionModal] = useState(false);
  const [initialShareModal, setInitialShareModal] = useState(false);
  const [loanModal, setLoanModal] = useState(false);
  const breakpoint = Grid.useBreakpoint();
  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  useEffect(() => {}, []);

  return (
    <>
      {!isMobile && (
        <Row>
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              style={{
                width: "35vw",
                display: "flex",
                justifyContent: "center",
                border: "1px solid  #FF2B18",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
              }}
            >
              <Button
                size="large"
                style={{fontSize: "18px"}}
                shape="round"
                onClick={() => setContributionModal(true)}
                icon={<PayCircleFilled style={{color: "#FF2B18"}} />}
              >
                Make Contributions Payments
              </Button>
            </Card>

            <Card
              style={{
                width: "35vw",
                display: "flex",
                justifyContent: "center",
                border: "1px solid  #FF2B18",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
              }}
            >
              <Button
                size="large"
                style={{fontSize: "18px"}}
                shape="round"
                onClick={() => setInitialShareModal(true)}
                icon={<PayCircleFilled style={{color: "#FF2B18"}} />}
              >
                Make Initial Shares Payments
              </Button>
            </Card>

            <Card
              style={{
                width: "35vw",
                display: "flex",
                justifyContent: "center",
                border: "1px solid  #FF2B18",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
              }}
            >
              <Button
                size="large"
                style={{fontSize: "18px"}}
                shape="round"
                onClick={() => setLoanModal(true)}
                icon={<PayCircleFilled style={{color: "#FF2B18"}} />}
              >
                Make Loans Payments
              </Button>
            </Card>
          </Col>
        </Row>
      )}

      {isMobile && (
        <Row>
          <Col span={24}>
            <Card
              style={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid  #FF2B18",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
              }}
            >
              <Button
                size="large"
                style={{fontSize: "18px"}}
                shape="round"
                onClick={() => setContributionModal(true)}
                icon={<PayCircleFilled style={{color: "#FF2B18"}} />}
              >
                Make Contributions Payments
              </Button>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid  #FF2B18",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
              }}
            >
              <Button
                size="large"
                style={{fontSize: "18px"}}
                shape="round"
                onClick={() => setInitialShareModal(true)}
                icon={<PayCircleFilled style={{color: "#FF2B18"}} />}
              >
                Make Initial Shares Payments
              </Button>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid  #FF2B18",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
              }}
            >
              <Button
                size="large"
                style={{fontSize: "18px"}}
                shape="round"
                onClick={() => setLoanModal(true)}
                icon={<PayCircleFilled style={{color: "#FF2B18"}} />}
              >
                Make Loans Payments
              </Button>
            </Card>
          </Col>
        </Row>
      )}

      <Modal
        title="Adding Contributions"
        open={contributionModal}
        destroyOnClose={true}
        width={isMobile ? "100vw" : "45vw"}
        footer={[]}
        onOk={() => {}}
        onCancel={() => setContributionModal(false)}
      >
        <ClientPaymentsAddingComponent serviceTag="kikoba_contribution_payment" />
      </Modal>

      <Modal
        title="Adding/Paying Initial Shares"
        open={initialShareModal}
        destroyOnClose={true}
        width={isMobile ? "100vw" : "45vw"}
        footer={[]}
        onOk={() => {}}
        onCancel={() => setInitialShareModal(false)}
      >
        <ClientPaymentsAddingComponent serviceTag="kikoba_initial_shares_payment" />
      </Modal>

      <Modal
        title="Adding/Paying Loans"
        open={loanModal}
        destroyOnClose={true}
        width={isMobile ? "100vw" : "45vw"}
        footer={[]}
        onOk={() => {}}
        onCancel={() => setLoanModal(false)}
      >
        <ClientLoanPaymentComponent serviceTag="kikoba_loans_payment" />
      </Modal>
    </>
  );
};
