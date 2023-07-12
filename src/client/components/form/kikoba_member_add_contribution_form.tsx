import {PlusCircleOutlined} from "@ant-design/icons";
import {
  Button,
  Form,
  InputNumber,
  message,
} from "antd";
import { useEffect } from "react";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";


interface formData {
  amount: string;
}

interface Props {
  onFinish: any;
  kikoba: any;
  member: any;
}

export const KikobaMemberAddContributionForm: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<formData>();

  const addShare = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("amount", values.amount);

    const data = await simpleRestProvider.custom!({
      method: "post",
      url:
        configs.apiUrl +
        `/kikoba/${props.kikoba.id}/member/${props.member.id}/contribution/add`,
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in creating Kikoba Policy");
        return {data: null};
      });
    if (data.data) {
      if (data.data.success) {
        props.onFinish();
        message.success(data.data.message);
        form.resetFields();
      } else {
        message.error(data.data.message);
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Form<formData>
        form={form}
        layout="vertical"
        onFinish={(values) => {
          addShare(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Amount(Share)"
          name="amount"
          rules={[
            {
              // validate amount to be greater than 0
              required: true,
              validator: async (_, amount) => {
                if (amount > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Amount must be greater than 0")
                );
              },
            },
          ]}
        >
          <InputNumber
            min={0.0}
            defaultValue={0.0}
            size="large"
            style={{width: "100%"}}
            onChange={() => {}}
          />
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
            icon={<PlusCircleOutlined />}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
