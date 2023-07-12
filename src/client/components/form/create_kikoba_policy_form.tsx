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
}

export const NewKikobaPolicyForm: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<formData>();

  const createKikobaPolicy = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("content", values.content);

    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + `/kikoba/policy/create/${props.kikoba.id}`,
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
          createKikobaPolicy(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
