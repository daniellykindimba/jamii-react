/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {SearchOutlined, PlusOutlined} from "@ant-design/icons";
import {useActiveAuthProvider, useGetIdentity} from "@refinedev/core";
import {Button, Descriptions, Form, Input, Spin, message} from "antd";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../../../../api";
import configs from "../../../../../configs";
import {DonationMemberData, UserData} from "../../../../../interfaces";

interface donationFormData {
  amount: string;
}

interface Props {
  onUpdate?: any;
  member?: DonationMemberData;
}

export const AddingMemberDonationForm: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<donationFormData>();

  const addMemberDonation = async (values: donationFormData) => {
    setLoading(true);

    let formData = new FormData();
    formData.append("amount", values.amount);

    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/donation/member/${props.member?.id}/add/donation`,
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
        message.success("Member Donation Added Successfully");
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
        <Form<donationFormData>
          layout="vertical"
          form={form}
          onFinish={(values) => {
            addMemberDonation(values);
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

          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={{float: "right"}}
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};
