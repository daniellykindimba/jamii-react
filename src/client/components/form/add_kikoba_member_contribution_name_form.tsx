import {Button, Form, Input, message} from "antd";
import {useEffect} from "react";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";

interface formData {
  name: string;
}

interface Props {
  onFinish: any;
  member: any;
}

export const AddKikobaMemberContributionNameForm: React.FC<Props> = (
  props: Props
) => {
  const [form] = Form.useForm<formData>();

  const createName = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("name", values.name);

    const data = await simpleRestProvider.custom!({
      method: "post",
      url:
        configs.apiUrl +
        `/kikoba/member/${props.member.id}/contribution/name/add`,
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in creating Kikoba Member Contribution Name");
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
          createName(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input Kikoba Member Contribution Name!",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter Kikoba Member Contribution Name ..."
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
          <Button type="primary" htmlType="submit" style={{float: "right"}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
