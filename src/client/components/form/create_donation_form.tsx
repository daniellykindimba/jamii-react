import {Button, DatePicker, Form, Input, InputNumber, message} from "antd";
import moment from "moment";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {RegionData, DistrictData} from "../../../interfaces";

const {TextArea} = Input;

interface formData {
  title: string;
  description: string;
  amount: number;
  deadline: Date;
}

interface Props {
  onFinish: any;
}
export const CreateDonationForm: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<formData>();

  const createDonation = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("title", values.title);
    formData.append("deadline", moment(values.deadline).format("YYYY-MM-DD"));
    formData.append("description", values.description);
    formData.append("amount", values.amount.toString());
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/donation/create",
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        message.error("Error in creating donation");
        return {data: null};
      });
    if (data.data) {
      if (data.data.success) {
        props.onFinish(data.data.donation);
        message.success(data.data.message);
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
          createDonation(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{required: true, message: "Please input Title!"}]}
        >
          <Input size="large" placeholder="Enter Title ..." />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{required: true, message: "Please input Description!"}]}
        >
          <TextArea rows={4} placeholder="Enter Description ..." />
        </Form.Item>

        <Form.Item
          label="Goal Amount"
          name="amount"
          rules={[
            {
              required: true,
              type: "number",
              message: "Enter Goal Amount!",
            },
          ]}
        >
          <InputNumber
            min={0.0}
            defaultValue={0.0}
            size="large"
            style={{width: "50%"}}
            onChange={() => {}}
          />
        </Form.Item>

        <Form.Item
          label="Deadline"
          name="deadline"
          rules={[
            {
              required: true,
              type: "date",
              message: "Choose Deadline!",
            },
          ]}
        >
          <DatePicker size="large" style={{width: "50%"}} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            style={{float: "left"}}
            onClick={() => form.resetFields()}
          >
            Clear
          </Button>
          <Button type="primary" htmlType="submit" style={{float: "right"}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
