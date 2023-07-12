import {Button, Form, InputNumber, Select, Tag, message} from "antd";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {KikobaMemberData} from "../../../interfaces";

interface formData {
  amount: number;
  member: number;
}

interface Props {
  onFinish: any;
  kikoba: any;
}

export const KikobaLoanApplicationForm: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<formData>();
  const [members, setMembers] = useState<KikobaMemberData[]>([]);
  const [selfApplication, setSelfApplication] = useState(true);

  const updateKikoba = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("amount", values.amount.toString());
    if (!selfApplication) {
      formData.append("member", values.member.toString());
    }

    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + `/kikoba/${props.kikoba}/loan/request/add`,
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in adding Kikoba Loan Request");
        return {data: null};
      });
    console.log(data);
    if (data.data) {
      if (data.data.success) {
        props.onFinish();
        message.success(data.data.message);
      } else {
        message.error(data.data.message);
      }
    }
  };

  const getMembers = async (key: string = "") => {
    message.destroy();
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${props.kikoba}/members?q=${key}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in getting Kikoba Members");
        return {data: null};
      });
    console.log(data);
    if (data.data) {
      setMembers(data.data.data);
    }
  };

  useEffect(() => {
    getMembers("");
  }, [props.kikoba]);

  return (
    <>
      <Form<formData>
        form={form}
        layout="vertical"
        onFinish={(values) => {
          updateKikoba(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Loan Amount"
          name="amount"
          rules={[
            ({getFieldValue}) => ({
              required: true,
              validator(_, value) {
                if (value > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Amount must be greater than zero!")
                );
              },
            }),
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

        {!selfApplication && (
          <Form.Item
            label="Kikoba Member"
            name="member"
            rules={[
              {
                required: !selfApplication,
                message: "Please Select Kikoba Member!",
              },
            ]}
          >
            <Select
              showSearch={true}
              size="large"
              style={{width: "100%"}}
              placeholder="Choose Kikoba Member ..."
              onSearch={(value: string) => {
                if (value.length < 3) {
                  if (value.length === 0) {
                    getMembers("");
                    return;
                  }
                  return;
                }
                getMembers(value);
                return;
              }}
              filterOption={false}
            >
              {members?.map((m: KikobaMemberData) => {
                return (
                  <Select.Option value={m.id} key={"contribution-type-" + m.id}>
                    {m.contributionName && <>{m.contributionName}</>}
                    {!m.contributionName && (
                      <>
                        {m.member.firstName} {m.member.middleName}{" "}
                        {m.member.lastName}
                      </>
                    )}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        )}

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

      <div style={{marginTop: 100}}>
        {selfApplication ? (
          <Button
            type="primary"
            onClick={() => {
              setSelfApplication(false);
            }}
            block
          >
            Submit Loan Application for other Member
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setSelfApplication(true);
            }}
            block
          >
            Self Loan Application
          </Button>
        )}
      </div>
    </>
  );
};
