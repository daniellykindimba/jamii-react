/* eslint-disable jsx-a11y/anchor-is-valid */
import {PayCircleFilled} from "@ant-design/icons";
import {
  Button,
  Image,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Tag,
  Spin,
  InputNumber,
  Alert,
  Card,
} from "antd";
import {useEffect, useState} from "react";
import {KikobaLoanData, KikobaMemberData} from "../../interfaces";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {useActiveAuthProvider, useGetIdentity} from "@refinedev/core";

// define a function to format number with thousand separator
const formatNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface Props {
  onUpdate?: any;
  serviceTag?: string;
}

export const ClientLoanPaymentComponent: React.FC<Props> = (props: Props) => {
  const [loans, setLoans] = useState<KikobaLoanData[]>([]);
  const [loan, setLoan] = useState<KikobaLoanData | any>(null);
  const [contributionModal, setContributionModal] = useState(false);

  const getKikobas = async () => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikobas/me/loans`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      if (data.data) {
        setLoans(data.data);
      }
    }
  };

  const handleLoanPaymentModal = (loan: KikobaLoanData) => {
    setLoan(loan);
    setContributionModal(true);
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
          dataSource={loans}
          renderItem={(loan: KikobaLoanData) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => {
                    handleLoanPaymentModal(loan);
                  }}
                  icon={<PayCircleFilled />}
                >
                  Pay
                </Button>,
              ]}
            >
              <span>
                <span style={{fontSize: 22}}>
                  {loan.kikobaMember.contributionName && (
                    <>{loan.kikobaMember.contributionName}</>
                  )}
                  {loan.kikobaMember.contributionName.length === 0 && (
                    <>
                      {loan.kikobaMember.member.firstName}{" "}
                      {loan.kikobaMember.member.middleName}{" "}
                      {loan.kikobaMember.member.lastName}
                    </>
                  )}
                  {loan.kikobaMember.nickname && (
                    <>&nbsp;&nbsp; -- {loan.kikobaMember.nickname}</>
                  )}
                </span>
                <Tag color="green" style={{marginLeft: 10}}>
                  {loan.kikoba.name}
                </Tag>
              </span>
            </List.Item>
          )}
        />
      </div>

      <Modal
        title="Loan Payment"
        open={contributionModal}
        destroyOnClose={true}
        width={"30vw"}
        footer={[]}
        onOk={() => {}}
        onCancel={() => setContributionModal(false)}
      >
        <ClientPaymentsAddingFormComponent
          loan={loan}
          member={loan?.kikobaMember}
          onUpdate={() => {}}
          serviceTag={props.serviceTag}
        />
      </Modal>
    </>
  );
};

interface PaymentForm {
  amount: number;
  phone: string;
  service_tag: string;
}

interface FormProps {
  onUpdate?: any;
  loan?: KikobaLoanData;
  member?: KikobaMemberData;
  serviceTag?: string;
}

const ClientPaymentsAddingFormComponent: React.FC<FormProps> = (
  props: FormProps
) => {
  const authProvider = useActiveAuthProvider();
  const [form] = Form.useForm<PaymentForm>();
  const [submitting, setSubmitting] = useState(false);
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const onFinish = async (values: PaymentForm) => {
    setSubmitting(true);
    const formData = new FormData();
    if (props.member?.id) {
      formData.append("member_id", props.member?.id.toString());
    }
    formData.append("amount", values.amount.toString());
    formData.append("phone", values.phone);
    formData.append("service_tag", props.serviceTag ?? "");
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/request/payment`,
      method: "post",
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });
    setSubmitting(false);
  };

  const getAmount = () => {
    let amount = props.loan?.amount ?? 0;
    let paidAmount = props.loan?.paidAmount ?? 0;
    return amount - paidAmount;
  };

  const getTitle = () => {
    return "Pay Loan";
  };

  useEffect(() => {
    form.setFieldsValue({
      amount: getAmount(),
      phone: user?.phone.replace("255", ""),
    });
  }, []);

  return (
    <>
      <Spin spinning={submitting}>
        <p
          style={{
            fontSize: 18,
            marginTop: 10,
          }}
        >
          Payments Marchants Supported
        </p>
        <Card>
          <Row>
            <Col span={24} style={{display: "flex"}}>
              <Image
                preview={false}
                width={300}
                height={100}
                src="images/payments/mpesa.png"
              />
              <Image
                preview={false}
                width={300}
                height={100}
                src="images/payments/tigopesa.png"
              />
              <Image
                preview={false}
                width={300}
                height={100}
                src="images/payments/airtelmoney.png"
              />
              {/* <Image
              preview={false}
              width={300}
              height={100}
              src="images/payments/tpesa.png"
            /> */}
              <Image
                preview={false}
                width={300}
                height={100}
                src="images/payments/halopesa.png"
              />
            </Col>
          </Row>
        </Card>

        <Row
          style={{
            marginBottom: 10,
          }}
        >
          <Col span={24}>
            <Alert
              description={
                <>
                  <Row>
                    <Col
                      span={24}
                      style={{display: "flex", justifyContent: "center"}}
                    >
                      <span style={{fontSize: 18}}>{getTitle()} for </span>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      span={24}
                      style={{display: "flex", justifyContent: "center"}}
                    >
                      <span
                        style={{
                          fontSize: 24,
                          fontWeight: "bolder",
                          // display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {props.member?.contributionName && (
                          <>{props.member?.contributionName}</>
                        )}
                        {!props.member?.contributionName && (
                          <>
                            {props.member?.member.firstName}{" "}
                            {props.member?.member.middleName}{" "}
                            {props.member?.member.lastName}
                          </>
                        )}
                      </span>
                    </Col>
                  </Row>
                </>
              }
            ></Alert>
          </Col>
        </Row>
        <Form<PaymentForm>
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log(values);
            onFinish(values);
          }}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              // custom validator to check not to be less than 1000
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject("Please Amount to pay is required");
                  }

                  if (parseFloat(value.toString()) < 1000) {
                    return Promise.reject(
                      "Amount to pay can't be less than 1000"
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              size="large"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Mobile Phone Number"
            name="phone"
            rules={[
              ({getFieldValue}) => ({
                async validator(_, value) {
                  if (!value)
                    return Promise.resolve(
                      new Error(
                        "The Mobile Phone Number must be 9 digits or more !"
                      )
                    );

                  if (value.length >= 9) {
                    //define form data
                    const formData = new FormData();
                    formData.append("phone", value);
                    const {data} = await simpleRestProvider.custom!({
                      url: configs.apiUrl + `/validate/mobile/phone`,
                      method: "post",
                      payload: formData,
                    })
                      .then((res) => {
                        return res;
                      })
                      .catch(() => {
                        return {data: null};
                      });
                    console.log(data);
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The Mobile Phone Number must be 9 digits or more !"
                    )
                  );
                },
              }),
            ]}
          >
            <Input
              size="large"
              prefix={
                <>
                  <Image
                    src="images/tanzania-flat.svg"
                    width="15"
                    height="15"
                    preview={false}
                    style={{
                      padding: 0,
                    }}
                  />
                  <span style={{marginLeft: 3, paddingTop: 3}}>+255</span>
                </>
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              style={{float: "left"}}
              icon={<PayCircleFilled />}
            >
              Lipa Number
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{float: "right"}}
              icon={<PayCircleFilled />}
            >
              Submit With Push
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};
