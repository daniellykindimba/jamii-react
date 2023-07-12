import {Button, Form, Input, message} from "antd";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {KikobaData} from "../../../interfaces";

interface formData {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  nickname: string;
}

interface Props {
  kikoba: KikobaData | any;
  onAdd?: any;
}

export const CreateNewKikobaMemberComponent: React.FC<Props> = (
  props: Props
) => {
  const [form] = Form.useForm<formData>();

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
        console.log(err);
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

  return (
    <>
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
            {required: true, message: "Please a valid Mobile Phone Number!"},
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

          <Button type="primary" htmlType="submit" style={{float: "right"}}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
