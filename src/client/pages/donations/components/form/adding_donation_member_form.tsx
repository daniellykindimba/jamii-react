/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
import {
  Button,
  Descriptions,
  Form,
  Grid,
  Input,
  Popconfirm,
  Spin,
  message,
} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../../../../api";
import configs from "../../../../../configs";
import {
  DonationData,
  DonationMemberData,
  RegionData,
  UserData,
} from "../../../../../interfaces";
interface phoneFormData {
  phone: string;
}

interface memberFormData {
  fullName: string;
  email: string;
}

interface Props {
  onUpdate?: any;
  donation?: DonationData;
}

export const AddingDonationMemberForm: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [step, setStep] = useState(1);

  const [member, setMember] = useState<UserData>();
  const [loading, setLoading] = useState(false);
  const [memberForm] = Form.useForm<memberFormData>();
  const [form] = Form.useForm<phoneFormData>();

  const addMember = async () => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url:
        configs.apiUrl +
        `/donation/${props.donation?.id}/add/member/${member?.id}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });

    if (data) {
      if (data.success) {
        message.success("Member Added");
        props.onUpdate();
        form.resetFields();
        memberForm.resetFields();
        setStep(1);
      } else {
        message.error(data.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <>
      {step === 0 && (
        <>
          <Spin spinning={loading}>
            <Descriptions title="User Informations" column={1}>
              <Descriptions.Item label="First Name">
                {member?.firstName}
              </Descriptions.Item>
              <Descriptions.Item label="Middle Name">
                {member?.middleName}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {member?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email Address">
                {member?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile Phone Number">
                {member?.phone}
              </Descriptions.Item>
            </Descriptions>
            <Button
              block
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => addMember()}
            >
              Add
            </Button>
          </Spin>
        </>
      )}

      {step === 1 && (
        <Form<phoneFormData>
          layout="vertical"
          form={form}
          onFinish={() => {
            setStep(2);
          }}
        >
          <Form.Item
            name="phone"
            rules={[
              {
                validator: async (_, phone) => {
                  if (phone) {
                    // check if phone length is 9 digits or more
                    if (phone.length >= 9) {
                      let formData = new FormData();
                      formData.append("phone", phone);

                      const data = await simpleRestProvider.custom!({
                        method: "post",
                        url: configs.apiUrl + "/user/phone",
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                        payload: formData,
                      })
                        .then((res) => {
                          return res;
                        })
                        .catch(() => {
                          message.error("Error Occured");
                          return null;
                        });
                      if (data) {
                        if (data.data.success) {
                          setMember(data.data.data);
                          setStep(0);
                          return Promise.resolve();
                        } else {
                          return Promise.reject(data.data.message);
                        }
                      }
                    }
                  }
                  return Promise.reject(
                    new Error("Please enter a valid Phone Number")
                  );
                },
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter Mobile Phone Number ..."
              prefix={<SearchOutlined />}
              autoComplete="off"
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={{width: "100%"}}
            >
              Search
            </Button>
          </Form.Item>
        </Form>
      )}

      {step === 2 && (
        <Form<memberFormData>
          layout="vertical"
          form={memberForm}
          onFinish={() => {}}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {required: true, message: "Please input Full Name!"},
              {
                validator: (_, value) => {
                  if (value.split(" ").length >= 2) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please enter atleast 2 Names")
                  );
                },
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter Full Name ..."
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item label="Email Address" name="email">
            <Input
              size="large"
              placeholder="Enter Email Address ..."
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={{
                float: "right",
              }}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};
