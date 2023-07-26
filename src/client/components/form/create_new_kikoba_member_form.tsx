import {Button, Descriptions, Form, Input, message} from "antd";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {KikobaData, KikobaMemberData, UserData} from "../../../interfaces";
import {useState} from "react";
import {PlusOutlined} from "@ant-design/icons";

interface formData {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  nickname: string;
}

interface prefFormData {
  phone: string;
}

interface Props {
  kikoba: KikobaData | any;
  onAdd?: any;
}

export const CreateNewKikobaMemberComponent: React.FC<Props> = (
  props: Props
) => {
  const [form] = Form.useForm<formData>();
  const [prefForm] = Form.useForm<prefFormData>();
  const [steps, setSteps] = useState<number>(0);
  const [member, setMember] = useState<UserData | any>(null);
  const [phone, setPhone] = useState<string>("");

  const createKikobaMember = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("firstName", values.first_name);
    formData.append("middleName", values.middle_name);
    formData.append("lastName", values.last_name);
    formData.append("phone", values.phone);
    formData.append("nickname", values.nickname);

    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + `/kikoba/${props.kikoba.id}/member/add`,
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in creating new Kikoba member");
        return {data: null};
      });
    if (data.data) {
      if (data.data.success) {
        message.success(data.data.message);
        props.onAdd();
      } else {
        message.error(data.data.message);
      }
    }
  };

  const checkMemberByForm = async (values: prefFormData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("phone", values.phone);
    setPhone(values.phone);

    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + `/user/${props.kikoba.id}/phone`,
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in creating new Kikoba member");
        return {data: null};
      });
    if (data.data) {
      if (data.data.success) {
        message.success(data.data.message);
        setMember(data.data.data);
      } else {
        message.error(data.data.message);
        if (data.data.next) {
          setSteps(1);
        }
      }
    }
  };

  const subscribeMember = async () => {
    message.destroy();
    const data = await simpleRestProvider.custom!({
      method: "get",
      url:
        configs.apiUrl + `/kikoba/${props.kikoba.id}/subscribe/${member.id}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in Subscribing new Kikoba member");
        return {data: null};
      });
    if (data.data) {
      if (data.data.success) {
        message.success(data.data.message);
        props.onAdd();
      } else {
        message.error(data.data.message);
      }
    }
  };

  return (
    <>
      {member ? (
        <>
          <Descriptions title="" column={1}>
            <Descriptions.Item label="First Name">
              {member.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Middle Name">
              {member.middleName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {member.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Phone Number">
              {member.phone}
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="primary"
            style={{float: "right"}}
            icon={<PlusOutlined />}
            size="large"
            onClick={subscribeMember}
          >
            Add
          </Button>
        </>
      ) : (
        <>
          {steps === 0 && (
            <Form<prefFormData>
              form={prefForm}
              layout="vertical"
              onFinish={(values) => {
                checkMemberByForm(values);
              }}
              autoComplete="off"
            >
              <Form.Item
                label="Mobile Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Mobile Phone Number!",
                  },
                  {
                    validator: async (_, phone) => {
                      if (phone) {
                        // check if phone length is 9 digits or more
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
                          console.log(data);
                          if (data) {
                            if (data.data.success) {
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
                <Input size="large" placeholder="Enter Mobile Phone Number" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  style={{float: "left"}}
                  onClick={() => prefForm.resetFields()}
                >
                  Clear
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{float: "right"}}
                >
                  Next
                </Button>
              </Form.Item>
            </Form>
          )}

          {steps === 1 && (
            <Form<formData>
              form={form}
              layout="vertical"
              onFinish={(values) => {
                createKikobaMember(values);
              }}
              autoComplete="off"
            >
              <Form.Item
                label="First Name"
                name="first_name"
                rules={[{required: true, message: "Please input First Name!"}]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Middle Name"
                name="middle_name"
                rules={[{required: true, message: "Please input Middle Name!"}]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="last_name"
                rules={[{required: true, message: "Please input Last Name!"}]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Nickname"
                name="nickname"
                rules={[{required: false, message: "Please input Nickname!"}]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Mobile Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please a valid Mobile Phone Number!",
                  },
                ]}
              >
                <Input size="large" prefix={"255"} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  style={{float: "left"}}
                  onClick={() => form.resetFields()}
                >
                  Clear
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{float: "right"}}
                >
                  Add
                </Button>
              </Form.Item>
            </Form>
          )}
        </>
      )}
    </>
  );
};
