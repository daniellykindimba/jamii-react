/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {SearchOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {useActiveAuthProvider, useGetIdentity} from "@refinedev/core";
import {Button, Descriptions, Form, Input, Spin, message} from "antd";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../../../../api";
import configs from "../../../../../configs";
import {
  DonationData,
  DonationMemberData,
  UserData,
} from "../../../../../interfaces";

interface disbursementFormData {
  amount: string;
  phone: string;
}

interface Props {
  onUpdate?: any;
  donation?: DonationData;
}

export const CreatingDonationDisbursementForm: React.FC<Props> = (
  props: Props
) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<disbursementFormData>();

  const createDisbursement = async (values: disbursementFormData) => {
    setLoading(true);

    let formData = new FormData();
    formData.append("amount", values.amount);
    formData.append("phone", values.phone);

    const {data} = await simpleRestProvider.custom!({
      url:
        configs.apiUrl + `/donation/${props.donation?.id}/disbursement/create`,
      method: "post",
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });

    if (data) {
      if (data.success) {
        message.success("Disbursement Created Successfully");
        props.onUpdate();
        form.resetFields();
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
      <Spin spinning={loading}>
        <Form<disbursementFormData>
          layout="vertical"
          form={form}
          onFinish={(values) => {
            createDisbursement(values);
          }}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                validator: async (_, value) => {
                  if (value > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Amount must be greater than 0")
                  );
                },
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter Donation Amount ..."
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number(Fund will be disbursed to this number)"
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
                        url: configs.apiUrl + "/validate/phone",
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
              autoComplete="off"
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={{float: "right"}}
              icon={<SaveOutlined />}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};
