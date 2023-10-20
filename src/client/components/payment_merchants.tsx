import {Row, Col, Image} from "antd";
import mpesa from "../../images/payments/mpesa.png";
import tigopesa from "../../images/payments/tigopesa.png";
import airtelmoney from "../../images/payments/airtelmoney.png";
import halopesa from "../../images/payments/halopesa.png";

interface Props {}

export const PaymentMerchantsComponent: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Row>
        <Col span={24} style={{display: "flex"}}>
          <Image preview={false} width={300} height={100} src={mpesa} />
          <Image preview={false} width={300} height={100} src={tigopesa} />
          <Image preview={false} width={300} height={100} src={airtelmoney} />
          {/* <Image preview={false} width={300} height={100} src={tpesa} /> */}
          <Image preview={false} width={300} height={100} src={halopesa} />
        </Col>
      </Row>
    </>
  );
};
