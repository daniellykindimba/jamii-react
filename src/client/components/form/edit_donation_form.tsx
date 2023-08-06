import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Tag,
  message,
} from "antd";
import moment from "moment";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {CKEditorComponent} from "../ckeditor_component";
import {DonationData} from "../../../interfaces";
import dayjs from "dayjs";

interface formData {
  title: string;
  description: string;
  amount: number;
  deadline: string;
  is_public: string;
  online_collection: string;
}

interface Props {
  onFinish: any;
  donation: DonationData | any;
}
export const EditDonationForm: React.FC<Props> = (props: Props) => {
  const [isPublic, setIsPublic] = useState(props.donation.isPublic);
  const [onlineDonation, setOnlineDonation] = useState(
    props.donation.onlineCollection
  );
  const [form] = Form.useForm<formData>();

  const createDonation = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("title", values.title);
    formData.append("deadline", moment(values.deadline).format("YYYY-MM-DD"));
    formData.append("description", values.description);
    formData.append("amount", values.amount.toString());
    formData.append("isPublic", values.is_public);
    formData.append("onlineCollection", values.online_collection);
    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/donation/" + props.donation.id + "/update",
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        message.error("Error in updating donation");
        return {data: null};
      });
    if (data.data) {
        console.log(data.data);
      if (data.data.success) {
        props.onFinish(data.data.donation);
        message.success(data.data.message);
      } else {
        message.error(data.data.message);
      }
    }
  };

  const handleOnEditorChange = (data: any) => {
    console.log(data);
  };

  useEffect(() => {}, []);

  return (
    <>
      <Form<formData>
        form={form}
        layout="vertical"
        onFinish={(values) => {
          values.is_public = isPublic ? "1" : "0";
          values.amount = values.amount ? values.amount : 0.0;
          // set deadline to 1 year from now if not set
          values.deadline = values.deadline
            ? values.deadline
            : moment().add(1, "years").format("YYYY-MM-DD");
          values.online_collection = onlineDonation ? "1" : "0";
          console.log(values);
          createDonation(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
        initialValues={{
          title: props.donation.title,
          description: props.donation.description,
          amount: props.donation.amount,
          deadline: dayjs(props.donation.deadline),
        }}
      >
        <Form.Item
          label="Public Availability"
          name="is_public"
          rules={[{required: false, message: "Please input Title!"}]}
        >
          <Checkbox
            checked={isPublic}
            onChange={(e) => {
              setIsPublic(e.target.checked);
            }}
          >
            Public
          </Checkbox>
        </Form.Item>
        <Form.Item
          label="Allow Online Donations"
          name="online_collection"
          rules={[{required: false}]}
        >
          <Checkbox
            checked={onlineDonation}
            onChange={(e) => {
              setOnlineDonation(e.target.checked);
            }}
          >
            Online Donations
          </Checkbox>
        </Form.Item>
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
          <CKEditorComponent
            data={props.donation.description}
            onChange={handleOnEditorChange}
          />
        </Form.Item>

        <Form.Item
          label={
            <>
              Goal Amount (Optional)
              <Tag color="green" style={{marginLeft: 10}}>
                if Left to be 0, Donations will be limitless
              </Tag>
            </>
          }
          name="amount"
          rules={[
            {
              required: false,
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
          label={
            <>
              Deadline (Optional)
              <Tag color="green" style={{marginLeft: 10}}>
                if Left Empty, Deadline will be set to 1 year from now
              </Tag>
            </>
          }
          name="deadline"
          rules={[
            {
              required: false,
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
            onClick={() => {
              setIsPublic(true);
              setOnlineDonation(false);
              form.resetFields();
            }}
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
