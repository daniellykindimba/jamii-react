/* eslint-disable jsx-a11y/anchor-is-valid */
import {Alert, Button, Card, Form, Input, Spin, message} from "antd";
import {useEffect, useState} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";

export interface phoneForm {
  phone: string;
}

export interface verificationForm {
  phone: string;
  code: string;
}

export interface passwordForm {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  rand?: any;
  onFinish?: any;
}

export const RecoverPasswordComponent: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState(0);
  const [formPhone] = Form.useForm<phoneForm>();
  const [formVerification] = Form.useForm<verificationForm>();
  const [formPassword] = Form.useForm<passwordForm>();
  const [validPhone, setValidPhone] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const requestVerificationCode = async (phone: string) => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    let formData = new FormData();
    formData.append("phone", phone);
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/user/password/recovery/request",
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
        setPhone(phone);
        setSteps(1);
        setSuccessMessage(data.data.message);
        setLoading(false);
      } else {
        setLoading(false);
        setErrorMessage(data.data.message);
        message.error(data.data.message);
      }
    }
  };

  const verifyingCode = async (code: string) => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    let formData = new FormData();
    formData.append("phone", phone);
    formData.append("otp", code);
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/otp/verify",
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
        setCode(code);
        setSteps(2);
        setSuccessMessage(
          data.data.message.replace("OTP", "Verification Code")
        );
        setLoading(false);
      } else {
        setLoading(false);
        setErrorMessage(data.data.message.replace("OTP", "Verification Code"));
        message.error(data.data.message);
      }
    }
  };

  const changePassword = async (password: string, confirmPassword: string) => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    let formData = new FormData();
    formData.append("phone", phone);
    formData.append("code", code);
    formData.append("password", password);
    formData.append("passwordConfirmation", confirmPassword);
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/user/password/change",
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
        setCode(code);
        setSteps(3);
        setSuccessMessage(
          data.data.message.replace("OTP", "Verification Code")
        );
        setLoading(false);
      } else {
        setLoading(false);
        setErrorMessage(data.data.message.replace("OTP", "Verification Code"));
        message.error(data.data.message);
      }
    }
  };

  useEffect(() => {}, [props.rand]);

  return (
    <>
      <Spin spinning={loading}>
        <Card headStyle={{borderBottom: 0, marginTop: 20}}>
          {successMessage !== "" && (
            <Alert
              style={{
                marginBottom: "12px",
              }}
              message={successMessage}
              type="success"
              showIcon
            />
          )}

          {errorMessage !== "" && (
            <Alert
              style={{
                marginBottom: "12px",
              }}
              message={errorMessage}
              type="error"
              showIcon
            />
          )}

          {steps === 0 && (
            <Form<phoneForm>
              layout="vertical"
              form={formPhone}
              onFinish={(values) => {
                requestVerificationCode(values.phone);
              }}
              requiredMark={false}
            >
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
                        // check if phone length is 9 digits or greater
                        if (phone.length >= 9) {
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
                          if (data) {
                            if (data.data.success) {
                              setValidPhone(true);
                              return Promise.resolve();
                            } else {
                              return Promise.reject(data.data.message);
                            }
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
              <Button
                type="primary"
                size="large"
                disabled={!validPhone}
                htmlType="submit"
                block
              >
                Proceed
              </Button>
            </Form>
          )}

          {steps === 1 && (
            <Form<verificationForm>
              layout="vertical"
              form={formVerification}
              onFinish={(values) => {
                verifyingCode(values.code);
              }}
              requiredMark={false}
              initialValues={{
                remember: false,
                email: "",
                password: "",
              }}
            >
              <Form.Item
                name="code"
                label={
                  <div>
                    <span>Enter Verification Code</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    type: "string",
                    message: "Enter Verification Code ...",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter Verification Code ..."
                  onChange={() => {}}
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
                htmlType="submit"
                block
                onClick={() => {}}
              >
                Verify
              </Button>
            </Form>
          )}

          {steps === 2 && (
            <Form<passwordForm>
              layout="vertical"
              form={formPassword}
              onFinish={(values) => {
                changePassword(values.password, values.confirmPassword);
              }}
              requiredMark={false}
            >
              <Form.Item
                name="password"
                label={
                  <div>
                    <span>Enter New Password</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    type: "string",
                    message: "Enter New Password ...",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder="Enter New Password ..."
                  onChange={() => {}}
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label={
                  <div>
                    <span>Confirm Password</span>
                  </div>
                }
                rules={[{required: true, message: "Confirm Password ..."}]}
                style={{marginBottom: "12px"}}
              >
                <Input
                  type="password"
                  placeholder="Re-Enter New Password"
                  size="large"
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
                htmlType="submit"
                block
              >
                Change Password
              </Button>
            </Form>
          )}

          {steps === 3 && (
            <div>
              <h2>Password Changed Successfully</h2>
              <Button
                type="ghost"
                size="large"
                style={{
                  backgroundColor: "red",
                  color: "white",
                  fontWeight: "bolder",
                }}
                block
                onClick={() => {
                  props.onFinish();
                }}
              >
                Go Back
              </Button>
            </div>
          )}
        </Card>
      </Spin>
    </>
  );
};
