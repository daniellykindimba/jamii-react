/* eslint-disable jsx-a11y/anchor-is-valid */
import {PayCircleFilled, PlusOutlined, SaveOutlined} from "@ant-design/icons";
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
  Tooltip,
  Alert,
  Card,
  Grid,
} from "antd";
import {useEffect, useState} from "react";
import {KikobaData, KikobaMemberData} from "../../interfaces";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {useActiveAuthProvider, useGetIdentity} from "@refinedev/core";

const {TextArea} = Input;

// define a function to format number with thousand separator
const formatNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface Props {
  onUpdate?: any;
  serviceTag?: string;
}

export const ClientPaymentsAddingComponent: React.FC<Props> = (
  props: Props
) => {
  const [loadidng, setLoading] = useState(false);
  const [kikobas, setKikobas] = useState<KikobaData[]>([]);

  const getKikobas = async () => {
    setLoading(true);
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
    setLoading(false);
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
          padding: 0,
        }}
      >
        <List
          size="small"
          style={{
            padding: 0,
          }}
          bordered
          dataSource={kikobas}
          loading={loadidng}
          itemLayout="horizontal"
          renderItem={(kikoba: KikobaData) => (
            <List.Item
              actions={[]}
              style={{
                padding: 2,
              }}
            >
              {kikoba.name}
              <Tag
                color="green"
                style={{
                  marginLeft: 10,
                }}
              >
                {props.serviceTag === "kikoba_contribution_payment" && (
                  <>{formatNumber(kikoba.contributionAmount)}</>
                )}
                {props.serviceTag === "kikoba_initial_shares_payment" && (
                  <>{formatNumber(kikoba.initialShare)}</>
                )}
              </Tag>

              <div style={{marginTop: 10}}>
                <ClientKikobaNamesComponent
                  kikoba={kikoba}
                  serviceTag={props.serviceTag}
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

interface ClientKikobaNamesProps {
  onUpdate?: any;
  kikoba: KikobaData;
  serviceTag?: string;
  loanApplication?: boolean;
}

export const ClientKikobaNamesComponent: React.FC<ClientKikobaNamesProps> = (
  props: ClientKikobaNamesProps
) => {
  const [loadidng, setLoading] = useState(false);
  const [members, setMembers] = useState<KikobaMemberData[]>([]);
  const [member, setMember] = useState<KikobaMemberData | any>(null);
  const [contributionModal, setContributionModal] = useState(false);
  const [loanApplicationModal, setLoanApplicationModal] = useState(false);

  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  const handleAddingContribution = (member: KikobaMemberData) => {
    setMember(member);
    setContributionModal(true);
  };

  const getMembership = async () => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/` + props.kikoba.id + `/membership`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      setMembers(data.data);
    }
    setLoading(false);
  };

  const getTitle = () => {
    if (props.serviceTag === "kikoba_contribution_payment") {
      return "Adding/Pay Contributions";
    } else if (props.serviceTag === "kikoba_initial_shares_payment") {
      return "Adding/Pay Initial Shares";
    }
  };

  const handleLoanApplicationModal = async (member: KikobaMemberData) => {
    setMember(member);
    setLoanApplicationModal(true);
  };

  useEffect(() => {
    getMembership();
  }, []);

  return (
    <>
      <div>
        <List
          size="small"
          bordered
          dataSource={members}
          loading={loadidng}
          renderItem={(member: KikobaMemberData) => (
            <List.Item
              actions={
                isMobile
                  ? []
                  : [
                      props.loanApplication && !isMobile && (
                        <Tooltip title="Click to Apply for Loan">
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleLoanApplicationModal(member)}
                          >
                            Apply
                          </Button>
                        </Tooltip>
                      ),
                      !props.loanApplication && !isMobile && (
                        <Tooltip title="Click to Pay">
                          <Button
                            type="primary"
                            disabled={props.kikoba.contributionAmount === 0}
                            icon={<PayCircleFilled />}
                            onClick={() => {
                              handleAddingContribution(member);
                            }}
                          >
                            Pay
                          </Button>
                        </Tooltip>
                      ),
                    ]
              }
            >
              <span>
                <span style={{fontSize: 22}}>
                  {member.contributionName && <>{member.contributionName}</>}
                  {!member.contributionName && (
                    <>
                      {member.member.firstName} {member.member.middleName}{" "}
                      {member.member.lastName}
                    </>
                  )}
                </span>

                <Tag style={{marginLeft: 10}} color="green">
                  Kikoba: {props.kikoba.name} -{" "}
                  {props.serviceTag === "kikoba_contribution_payment" && (
                    <>{formatNumber(props.kikoba.contributionAmount)}</>
                  )}
                  {props.serviceTag === "kikoba_initial_shares_payment" && (
                    <>{formatNumber(props.kikoba.initialShare)}</>
                  )}
                </Tag>

                {isMobile && (
                  <div>
                    {props.loanApplication && isMobile && (
                      <Tooltip title="Click to Apply for Loan">
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => handleLoanApplicationModal(member)}
                        >
                          Apply
                        </Button>
                      </Tooltip>
                    )}
                    {!props.loanApplication && isMobile && (
                      <Tooltip title="Click to Pay">
                        <Button
                          style={{float: "right"}}
                          type="primary"
                          disabled={props.kikoba.contributionAmount === 0}
                          icon={<PayCircleFilled />}
                          onClick={() => {
                            handleAddingContribution(member);
                          }}
                        >
                          Pay
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                )}
              </span>
            </List.Item>
          )}
        />
      </div>

      <Modal
        title={getTitle() + "  to " + props.kikoba?.name}
        open={contributionModal}
        destroyOnClose={true}
        width={"30vw"}
        footer={[]}
        onOk={() => {}}
        onCancel={() => setContributionModal(false)}
      >
        <ClientPaymentsAddingFormComponent
          member={member}
          onUpdate={() => {}}
          serviceTag={props.serviceTag}
        />
      </Modal>

      <Modal
        title="Loan Application Form"
        open={loanApplicationModal}
        destroyOnClose={true}
        width={"33vw"}
        footer={[]}
        onOk={() => {}}
        onCancel={() => setLoanApplicationModal(false)}
      >
        <ClientLoanApplicationForm
          member={member}
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
        console.log(error);
        return {data: null};
      });
    console.log(data);
    setSubmitting(false);
  };

  const getAmount = () => {
    if (props.serviceTag === "kikoba_contribution_payment") {
      return props.member?.kikoba.contributionAmount;
    }
    if (props.serviceTag === "kikoba_initial_shares_payment") {
      return props.member?.kikoba.initialShare;
    }
    return 0;
  };

  const getTitle = () => {
    if (props.serviceTag === "kikoba_contribution_payment") {
      return "Kikoba Contributions Payment ";
    } else if (props.serviceTag === "kikoba_initial_shares_payment") {
      return "Initial Shares Payment ";
    }
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
        <Card size="small">
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                    }}
                  >
                    {getTitle()} for{" "}
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: "bolder",
                        display: "flex",
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
                  </span>
                </div>
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
          size="small"
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

interface LoanApplicationForm {
  amount: number;
  description: string;
}

interface LoanFormProps {
  onUpdate?: any;
  member?: KikobaMemberData;
  serviceTag?: string;
}

interface LoanResponse {
  success?: boolean;
  message?: string | any;
}

const ClientLoanApplicationForm: React.FC<LoanFormProps> = (
  props: LoanFormProps
) => {
  const [form] = Form.useForm<LoanApplicationForm>();
  const [response, setResponse] = useState<LoanResponse>({
    success: false,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const onFinish = async (values: LoanApplicationForm) => {
    setSubmitting(true);
    const formData = new FormData();
    if (props.member?.id) {
      formData.append("member_id", props.member?.id.toString());
    }
    formData.append("amount", values.amount.toString());
    formData.append("description", values?.description?.toString() ?? "");
    formData.append("service_tag", props.serviceTag ?? "");
    const {data} = await simpleRestProvider.custom!<LoanResponse>({
      url:
        configs.apiUrl +
        `/kikoba/` +
        props.member?.kikoba.id +
        `/loan/request/add`,
      method: "post",
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
        return {data: null};
      });
    if (data) {
      setResponse(data);
    }
    setSubmitting(false);
  };

  useEffect(() => {}, []);

  return (
    <>
      {response.message && response?.message.length > 0 && (
        <Alert
          type="success"
          description={
            <span>
              <Row>
                <Col
                  span={24}
                  style={{display: "flex", justifyContent: "center"}}
                >
                  <span style={{display: "block", fontSize: 22}}>
                    Your loan application has been submitted Successfully
                  </span>
                </Col>
                <Col
                  span={24}
                  style={{display: "flex", justifyContent: "center"}}
                >
                  <Button size="large">View Loan Approval Status</Button>
                </Col>
              </Row>
            </span>
          }
        />
      )}
      {!(response?.message.length > 0) && (
        <Spin spinning={submitting}>
          <Alert
            type="info"
            description={
              <span style={{fontSize: 22}}>
                Loan Application: &nbsp;
                <span style={{fontWeight: "bolder"}}>
                  {props.member?.contributionName &&
                    props.member?.contributionName}
                  {!props.member?.contributionName && (
                    <>
                      {props.member?.member.firstName}{" "}
                      {props.member?.member.middleName}{" "}
                      {props.member?.member.lastName}
                    </>
                  )}
                </span>
                {props.member?.nickname && (
                  <Tag color="green" style={{marginLeft: 5}}>
                    {props.member?.nickname}
                  </Tag>
                )}
              </span>
            }
            style={{
              marginBottom: 5,
              marginTop: 10,
            }}
          />
          <Form<LoanApplicationForm>
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
              label="Loan Amount"
              name="amount"
              rules={[
                // custom validator to check not to be less than 1000
                ({getFieldValue}) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject("Please Loan Amount is required");
                    }

                    if (parseFloat(value.toString()) < 1000) {
                      return Promise.reject(
                        "Loan Amount can't be less than 1000"
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

            <Form.Item label="Description" name="description" rules={[]}>
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{float: "right"}}
                icon={<SaveOutlined />}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      )}
    </>
  );
};
