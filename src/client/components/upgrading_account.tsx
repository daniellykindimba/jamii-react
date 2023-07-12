import {
  message,
  Row,
  Col,
  Card,
  Form,
  Spin,
  Button,
  Input,
  InputNumber,
  Image,
  Descriptions,
} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData} from "../../interfaces";
import {PayCircleFilled} from "@ant-design/icons";
import tanzaniaFlag from "../../images/tanzania-flat.svg";
import {PaymentMerchantsComponent} from "./payment_merchants";

interface UpgradeParameter {
  total_members: number;
  price_per_member: number;
  total_price: number;
  total_price_per_year: number;
}

interface PaymentForm {
  amount: number;
  phone: string;
  service_tag: string;
}

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

export const UpgradingKikobaAccountComponent: React.FC<Props> = (
  props: Props
) => {
  const [parameter, setParameter] = useState<UpgradeParameter>();
  const [submitting, setSubmitting] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [form] = Form.useForm<PaymentForm>();
  let {id} = useParams<{id: string}>();

  const getUpgradeParameters = async () => {
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${props.kikoba.id}/upgrade/parameters`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in getting Kikoba");
        return {data: null};
      });

    if (data.data) {
      setParameter(data.data.data);
      form.setFieldsValue({
        amount: data.data.data.total_price_per_year,
      });
    }
  };

  useEffect(() => {
    getUpgradeParameters();
  }, [props.kikoba]);

  return (
    <>
      <Spin spinning={submitting}>
        <p
          style={{
            fontSize: 18,
            marginTop: 10,
          }}
        >
          Payments Marchants Supported
        </p>
        <Card>
          <PaymentMerchantsComponent />
        </Card>

        <div>
          <Descriptions title="Billing Info's" column={1}>
            <Descriptions.Item label="Total Members">
              {parameter?.total_members}
            </Descriptions.Item>
            <Descriptions.Item label="Price Per Member">
              {parameter?.price_per_member}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price Per Month">
              {parameter?.total_price}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price Per Year">
              {parameter?.total_price_per_year}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Form<PaymentForm>
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log(values);
          }}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              // custom validator to check not to be less than 1000
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject("Please Amount to pay is required");
                  }

                  if (parseFloat(value.toString()) < 1000) {
                    return Promise.reject(
                      "Amount to pay can't be less than 1000"
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              disabled
              size="large"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Mobile Phone Number"
            name="phone"
            rules={[
              ({getFieldValue}) => ({
                async validator(_, value) {
                  if (!value)
                    return Promise.resolve(
                      new Error(
                        "The Mobile Phone Number must be 9 digits or more !"
                      )
                    );

                  if (value.length >= 9) {
                    //define form data
                    const formData = new FormData();
                    formData.append("phone", value);
                    const {data} = await simpleRestProvider.custom!({
                      url: configs.apiUrl + `/validate/mobile/phone`,
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
                      setValidPhone(data.success);
                    }
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The Mobile Phone Number must be 9 digits or more !"
                    )
                  );
                },
              }),
            ]}
          >
            <Input
              size="large"
              prefix={
                <>
                  <Image
                    src={tanzaniaFlag}
                    width="15"
                    height="15"
                    preview={false}
                    style={{
                      padding: 0,
                    }}
                  />
                  <span style={{marginLeft: 3, paddingTop: 3}}>+255</span>
                </>
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{float: "right"}}
              icon={<PayCircleFilled />}
              disabled={!validPhone}
            >
              Pay
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};
