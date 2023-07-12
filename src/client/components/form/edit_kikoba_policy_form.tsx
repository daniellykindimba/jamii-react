import {
  Button,
  Form,
  Input,
  message,
} from "antd";
import { useEffect } from "react";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";

const {TextArea} = Input;

interface formData {
  content: string;
}

interface Props {
  onFinish: any;
  kikoba: any;
  policy: any;
}

export const EditKikobaPolicyForm: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<formData>();

  const updateKikobaPolicy = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("policy_id", props.policy.id);
    formData.append("content", values.content);

    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + `/kikoba/policy/update/${props.policy.id}`,
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
          updateKikobaPolicy(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
        initialValues={{
          content: props.policy.content,
        }}
      >
        <Form.Item
          label="Content"
          name="content"
          rules={[
            {required: true, message: "Please input Kikoba Policy Content!"},
          ]}
        >
          <TextArea rows={8} />
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
            Update
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
