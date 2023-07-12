import {message, Row, Col, Card, Descriptions} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData} from "../../interfaces";
import {KikobaPoliciesComponent} from "./kikoba_policies";

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

export const KikobaInfosComponent: React.FC<Props> = (props: Props) => {
  const [kikoba, setKikoba] = useState<KikobaData>();

  let {id} = useParams<{id: string}>();

  const getKikoba = async () => {
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${props.kikoba.id}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in getting Kikoba");
        return {data: null};
      });

    if (data.data) {
      console.log(data.data.data);
      setKikoba(data.data.data);
    }
  };

  useEffect(() => {
    getKikoba();
  }, [props.kikoba]);

  return (
    <>
      <Row>
        <Col
          span={16}
          style={{
            padding: 10,
          }}
        >
          <KikobaPoliciesComponent kikoba={props.kikoba} />
        </Col>
        <Col span={8}>
          <Card>
            <Descriptions title="Particular Kikoba Info's" column={1}>
              <Descriptions.Item label="Name">{kikoba?.name}</Descriptions.Item>
              <Descriptions.Item label="Code">
                {kikoba?.registrationNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Contribution Frequency">
                {kikoba?.contributionType}
              </Descriptions.Item>
              <Descriptions.Item label="Initial Share">
                {kikoba?.initialShare}
              </Descriptions.Item>
              <Descriptions.Item label="Interest Rate">
                {kikoba?.interestRate}
              </Descriptions.Item>

              <Descriptions.Item label="Payment Mode">
                {kikoba?.paymentMode.toString().replace("_", " ").toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Members Allowed to Self Apply for Loan">
                {kikoba?.allowClientLoanApplication ? "Yes" : "No"}
              </Descriptions.Item>

              <Descriptions.Item label="Start Date">
                {kikoba?.startDate}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {kikoba?.endDate}
              </Descriptions.Item>
              <Descriptions.Item label="Region">
                {kikoba?.region.name}
              </Descriptions.Item>
              <Descriptions.Item label="District">
                {kikoba?.district.name}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </>
  );
};
