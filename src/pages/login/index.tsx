/* eslint-disable jsx-a11y/anchor-is-valid */
import {ThemedLayoutV2} from "@refinedev/antd";
import {useLogin, useNavigation} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import {useEffect} from "react";
import configs from "../../configs";
import AppFooter from "../footer";
import queryString from "query-string";
import logo from "../../images/jamii.png";

const {Text, Title} = Typography;

export interface ILoginForm {
  username: string;
  password: string;
}

export interface RedeemForm {
  reedemCode: string;
}

export interface SystemSettingsData {
  allowUserPublicRegistration: boolean;
}

export const Login: React.FC = () => {
  const [form] = Form.useForm<ILoginForm>();
  const {mutate: login, error, isSuccess} = useLogin<ILoginForm>();
  const {push} = useNavigation();
  const params = queryString.parse(window.location.search);
  const to = new Array(params.to).filter((value) => value !== null).join(",");

  const customLogin = async (values: ILoginForm) => {
    login(
      values, 
    );
  };

  const CardTitle = (
    <div style={{display: "flex", justifyContent: "center"}}>
      <Title level={5} className="title">
        Sign in your account
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
          <Row
            justify="center"
            align="middle"
            style={{
              height: "80vh",
            }}
          >
            <Col xs={22} xl={5} xxl={5} style={{marginBottom: 20}}>
              <div className="container">
                <div className="imageContainer">
                  <Row>
                    <Col
                      span={24}
                      style={{display: "flex", justifyContent: "center"}}
                    >
                      <Avatar
                        size={100}
                        src={logo}
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
                <>
                  <Card
                    title={CardTitle}
                    headStyle={{borderBottom: 0, marginTop: 20}}
                  >
                    <Form<ILoginForm>
                      layout="vertical"
                      form={form}
                      onFinish={(values) => {
                        customLogin(values);
                      }}
                      requiredMark={false}
                      initialValues={{
                        remember: false,
                        email: "",
                        password: "",
                      }}
                    >
                      <Form.Item
                        name="username"
                        label={
                          <div>
                            <span>Username (Mobile Phone Number)</span>
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            type: "string",
                            message: "Enter Username (Mobile Phone Number) ...",
                          },
                        ]}
                      >
                        <Input
                          // disabled={isSuccess}
                          size="large"
                          placeholder="Enter Username (Mobile Phone Number) ..."
                          onChange={() => {}}
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
                          {required: true, message: "Provide Password ..."},
                        ]}
                        style={{marginBottom: "12px"}}
                      >
                        <Input
                          type="password"
                          placeholder=""
                          size="large"
                          // disabled={isSuccess}
                        />
                      </Form.Item>
                      <div style={{marginBottom: "50px", marginTop: "10px"}}>
                        <a
                          style={{
                            float: "right",
                            fontSize: "16px",
                          }}
                          onClick={() => push("/forgot_password")}
                        >
                          Forgot password?
                        </a>
                      </div>
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
                        Sign in
                      </Button>
                    </Form>
                    <div style={{marginTop: 8}}>
                      <Text>
                        Don’t have an account?{" "}
                        <a
                          onClick={() => push("/register?to=" + to)}
                          style={{fontWeight: "bold"}}
                        >
                          Sign up
                        </a>
                      </Text>
                    </div>
                  </Card>
                </>
              </div>
            </Col>
          </Row>
        </ThemedLayoutV2>
      </ConfigProvider>
    </>
  );
};
