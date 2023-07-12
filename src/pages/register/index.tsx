/* eslint-disable jsx-a11y/anchor-is-valid */
import {LoginOutlined} from "@ant-design/icons";
import {ThemedLayoutV2} from "@refinedev/antd";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Typography,
  message,
} from "antd";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import AppFooter from "../footer";
import {useNavigation} from "@refinedev/core";
import queryString from "query-string";

const {Text, Title} = Typography;

export interface registerForm {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface verifyOtpForm {
  phone: string;
  otp: string;
}

export interface SystemSettingsData {
  allowUserPublicRegistration: boolean;
}

export const Register: React.FC = () => {
  const [form] = Form.useForm<registerForm>();
  const [phone, setPhone] = useState("");
  const [registered, setRegistered] = useState(false);
  const [otpVerification, setOtpVerification] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [userVerifiedMessage, setUserVerifiedMessage] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifyForm] = Form.useForm<verifyOtpForm>();
  const [loginRedeem, setLoginRedeem] = useState(false);
  const [successfullyLoggedIn, setSuccessfullyLoggedIn] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);
  const {push} = useNavigation();
  const params = queryString.parse(window.location.search);
  const to = new Array(params.to).filter((value) => value !== null).join(",");

  const verifyUserOtp = async (phone: string, otp: string) => {
    let formData = new FormData();
    formData.append("phone", phone);
    formData.append("otp", otp);
    setVerifyingOtp(true);
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/otp/verify/user",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return {data: null};
      });

    if (data.data) {
      if (data.data.success) {
        setUserVerified(true);
        setUserVerifiedMessage(data.data.message);
      } else {
        setUserVerified(false);
      }
    }
    setVerifyingOtp(false);
    setOtpVerification(false);
  };

  const createOtp = async (phone: string) => {
    let formData = new FormData();
    formData.append("phone", phone);
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/otp/create",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return {data: null};
      });

    console.log("=======OTP requesting");
    console.log(data);
  };

  const customRegister = async (values: registerForm) => {
    message.destroy();
    setPhone(values.phone);
    let formData = new FormData();
    formData.append("first_name", values.firstName);
    formData.append("middle_name", values.middleName);
    formData.append("last_name", values.lastName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("password", values.password);
    formData.append("confirm_password", values.confirmPassword);
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/register",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error(err);
        message.error("Login Failed, please try again ...");
        return {data: null};
      });

    if (data.data) {
      if (data.data.success) {
        message.success("Registration Successful");
        setRegistered(true);
        setOtpVerification(true);
      } else {
        setRegistered(false);
        message.error(data.data.message);
      }
    }

    console.log(data);
  };

  const CardTitle = (
    <div style={{display: "flex", justifyContent: "center"}}>
      <Title level={5} className="title">
        Registration Form
      </Title>
    </div>
  );

  useEffect(() => {}, []);

  return (
    <>
      <ConfigProvider componentSize="small" virtual={true}>
        <ThemedLayoutV2
          Sider={() => <></>}
          Header={() => <></>}
          Footer={() => <AppFooter />}
        >
          <Row justify="center" align="middle">
            <Col xs={22} xl={6} xxl={6} style={{marginBottom: 20}}>
              <div className="container">
                <div className="imageContainer">
                  <Row>
                    <Col
                      span={24}
                      style={{display: "flex", justifyContent: "center"}}
                    >
                      <Avatar
                        size={100}
                        src={configs.logo}
                        style={{
                          marginBottom: 10,
                          backgroundColor: configs.primaryColor,
                        }}
                      />
                    </Col>
                    <Col
                      span={24}
                      style={{display: "flex", justifyContent: "center"}}
                    >
                      <Title level={3} className="title">
                        {configs.system_name}
                      </Title>
                    </Col>
                  </Row>
                </div>

                {registered && !userVerified && (
                  <Alert
                    message={
                      "Registration Successful, Please Use the OTP sent to " +
                      phone +
                      " to verify your account"
                    }
                    type="success"
                  />
                )}

                {userVerified && (
                  <>
                    <Alert
                      message={
                        <>
                          <span style={{fontSize: 24}}>
                            {userVerifiedMessage}
                          </span>
                        </>
                      }
                      type="success"
                      showIcon
                    />
                    <Link to={"/login"}>
                      <Button block icon={<LoginOutlined />} size="large">
                        Login to Continue
                      </Button>
                    </Link>
                  </>
                )}

                {!otpVerification && !userVerified && (
                  <Card
                    title={CardTitle}
                    headStyle={{borderBottom: 0, marginTop: 20}}
                  >
                    <Form<registerForm>
                      layout="vertical"
                      form={form}
                      onFinish={(values) => {
                        customRegister(values);
                      }}
                      requiredMark={true}
                      initialValues={{
                        remember: false,
                        email: "",
                        password: "",
                      }}
                    >
                      <Form.Item
                        name="firstName"
                        label={
                          <div>
                            <span>First Name</span>
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            type: "string",
                            message: "Enter First Name ...",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Enter First Name ..."
                          onChange={(e) => {}}
                        />
                      </Form.Item>
                      <Form.Item
                        name="middleName"
                        label={
                          <div>
                            <span>Middle Name</span>
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            type: "string",
                            message: "Enter Middle Name ...",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Enter Middle Name ..."
                          onChange={(e) => {}}
                        />
                      </Form.Item>
                      <Form.Item
                        name="lastName"
                        label={
                          <div>
                            <span>Last Name</span>
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            type: "string",
                            message: "Enter Last Name ...",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Enter Last Name ..."
                          onChange={(e) => {}}
                        />
                      </Form.Item>
                      <Form.Item
                        name="phone"
                        label={
                          <div>
                            <span>Mobile Phone Number</span>
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            type: "string",
                            message: "Enter Mobile Phone Number ...",
                          },
                          // remote validation for phone number using post method
                          {
                            validator: async (_, phone) => {
                              if (phone) {
                                let formData = new FormData();
                                formData.append("phone", phone);

                                const data = await simpleRestProvider.custom!({
                                  method: "post",
                                  url: configs.apiUrl + "/validate/phone",
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                  payload: formData,
                                })
                                  .then((res) => {
                                    return res;
                                  })
                                  .catch((err) => {
                                    message.error("Error Occured");
                                    return null;
                                  });
                                console.log(data);
                                if (data) {
                                  if (data.data.success) {
                                    return Promise.resolve();
                                  } else {
                                    return Promise.reject(data.data.message);
                                  }
                                }
                              }
                            },
                          },
                          // validate if phone number is alradey registered
                          {
                            validator: async (_, phone) => {
                              if (phone) {
                                let formData = new FormData();
                                formData.append("phone", phone);

                                const data = await simpleRestProvider.custom!({
                                  method: "post",
                                  url:
                                    configs.apiUrl +
                                    "/validate/phone/registered",
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                  payload: formData,
                                })
                                  .then((res) => {
                                    return res;
                                  })
                                  .catch((err) => {
                                    message.error("Error Occured");
                                    return null;
                                  });
                                console.log(data);
                                if (data) {
                                  if (data.data.success) {
                                    return Promise.resolve();
                                  } else {
                                    return Promise.reject(data.data.message);
                                  }
                                }
                              }
                            },
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          prefix="+255"
                          placeholder="Enter Mobile Phone Number ..."
                          onChange={(e) => {}}
                        />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label={
                          <div>
                            <span>Email Address</span>
                          </div>
                        }
                        rules={[
                          {
                            required: false,
                            type: "string",
                            message: "Enter Email Address ...",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Enter Email Address ..."
                          onChange={(e) => {}}
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label={
                          <div>
                            <span>Password</span>
                          </div>
                        }
                        rules={[
                          {required: true, message: "Enter Password ..."},
                        ]}
                        style={{marginBottom: "12px"}}
                      >
                        <Input
                          type="password"
                          placeholder="Enter Password ..."
                          size="large"
                        />
                      </Form.Item>
                      <Form.Item
                        name="confirmPassword"
                        label={
                          <div>
                            <span>Confirm Password</span>
                          </div>
                        }
                        rules={[
                          {required: true, message: "Confirm Password ..."},
                        ]}
                        style={{marginBottom: "12px"}}
                      >
                        <Input type="password" placeholder="" size="large" />
                      </Form.Item>
                      <Button
                        type="ghost"
                        size="large"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          fontWeight: "bolder",
                        }}
                        htmlType="submit"
                        block
                      >
                        Sign up
                      </Button>
                    </Form>
                    <div style={{marginTop: 8}}>
                      <Text>
                        Have an account?{" "}
                        <a
                          onClick={() => push("/login?to=" + to)}
                          style={{fontWeight: "bold"}}
                        >
                          Sign in
                        </a>
                      </Text>
                    </div>
                  </Card>
                )}

                {otpVerification && (
                  <Card
                    title={CardTitle}
                    headStyle={{borderBottom: 0, marginTop: 20}}
                  >
                    <Form<verifyOtpForm>
                      layout="vertical"
                      form={verifyForm}
                      onFinish={(values) => {
                        verifyUserOtp(phone, values.otp);
                      }}
                      requiredMark={true}
                    >
                      <Form.Item
                        name="otp"
                        label={
                          <div>
                            <span>OTP</span>
                          </div>
                        }
                        rules={[
                          {
                            required: false,
                            type: "string",
                            message: "Enter OTP Code ...",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Enter OTP Code ..."
                          onChange={(e) => {}}
                        />
                      </Form.Item>
                      <Button
                        type="ghost"
                        size="large"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          fontWeight: "bolder",
                        }}
                        onClick={() => verifyForm.submit()}
                        block
                      >
                        Verify
                      </Button>
                    </Form>
                    <div style={{marginTop: 8}}>
                      <Text>
                        Have an account?{" "}
                        <a
                          onClick={() => push("/login?to=" + to)}
                          style={{fontWeight: "bold"}}
                        >
                          Sign in
                        </a>
                      </Text>
                    </div>
                  </Card>
                )}
              </div>
            </Col>
          </Row>
        </ThemedLayoutV2>
      </ConfigProvider>
    </>
  );
};
