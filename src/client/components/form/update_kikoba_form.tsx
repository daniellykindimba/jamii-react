import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {RegionData, DistrictData} from "../../../interfaces";

interface formData {
  name: string;
  start_date: Date;
  end_date: Date;
  interest_rate: number;
  initial_share: number;
  region_id: number;
  district_id: number;
  contribution_frequency: string;
  contribution_amount: number;
  allow_client_loan_application: boolean;
  payment_mode: string;
}

interface Props {
  onFinish: any;
  kikoba: any;
}

const payment_modes = [
  {
    key: "full_digital",
    name: "Full Digital",
  },
  {
    key: "semi_digital",
    name: "Semi Digital",
  },
  {
    key: "Manual",
    name: "Manual",
  },
];

export const UpdateKikobaForm: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<formData>();
  const [regions, setRegions] = useState<RegionData[]>();
  const [districts, setDistricts] = useState<DistrictData[]>();
  const [contributionsTypes, setContributionsTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | any>(
    dayjs(props.kikoba.startDate)
  );
  const [endDate, setEndDate] = useState<Date | any>(
    dayjs(props.kikoba.endDate)
  );

  const updateKikoba = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append(
      "start_date",
      dayjs(values.start_date).format("YYYY-MM-DD")
    );
    formData.append("end_date", dayjs(values.end_date).format("YYYY-MM-DD"));
    formData.append("interest_rate", values.interest_rate.toString());
    formData.append("region_id", values.region_id.toString());
    formData.append("district_id", values.district_id.toString());
    formData.append("initial_share", values.initial_share.toString());
    formData.append(
      "allow_client_loan_application",
      values.allow_client_loan_application.toString()
    );
    formData.append("payment_mode", values.payment_mode.toString());
    formData.append(
      "contribution_frequency",
      values.contribution_frequency.toString()
    );
    formData.append(
      "contribution_amount",
      values.contribution_amount.toString()
    );

    const data = await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + `/kikoba/${props.kikoba.id}/update`,
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in Updating Kikoba");
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

  const getRegions = async () => {
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + "/regions",
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Login Failed, please try again ...");
        return {data: null};
      });

    if (data.data) {
      setRegions([...data.data.data]);
    }
  };

  const getDistricts = async (region_id: number) => {
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + "/districts/in/region/" + region_id,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in getting region districts");
        return {data: null};
      });
    if (data.data) {
      setDistricts([...data.data.data]);
    }
  };

  const getContributionsTypes = async (days: number) => {
    console.log(`/kikoba/contributions/types?days=${days}`);
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/contributions/types?days=${days}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Login Failed, please try again ...");
        return {data: null};
      });

    if (data.data) {
      setContributionsTypes(data.data.data);
    }
  };

  useEffect(() => {
    if (props.kikoba.startDate && props.kikoba.endDate) {
      const days = dayjs(props.kikoba.endDate).diff(
        props.kikoba.startDate,
        "days"
      );
      getContributionsTypes(days);
    }
    getRegions();
    getDistricts(props.kikoba.region.id);
  }, []);

  return (
    <>
      <Form<formData>
        form={form}
        layout="vertical"
        onFinish={(values) => {
          values.start_date = dayjs(startDate).toDate();
          values.end_date = dayjs(endDate).toDate();
          values.initial_share = values.initial_share
            ? values.initial_share
            : 0.0;
          values.interest_rate = values.interest_rate
            ? values.interest_rate
            : 0.0;
          updateKikoba(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
        initialValues={{
          name: props.kikoba.name,
          start_date: dayjs(props.kikoba.startDate),
          end_date: dayjs(props.kikoba.endDate),
          interest_rate: props.kikoba.interest_rate,
          initial_share: props.kikoba.initialShare,
          region_id: props.kikoba.region.id,
          district_id: props.kikoba.district.id,
          contribution_frequency: props.kikoba.contributionType,
          contribution_amount: props.kikoba.contributionAmount,
          payment_mode: props.kikoba.paymentMode,
          allow_client_loan_application:
            props.kikoba.allowClientLoanApplication,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{required: true, message: "Please input Kikoba Name!"}]}
        >
          <Input size="large" placeholder="Enter Kikoba Name ..." />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="start_date"
          rules={[
            {required: true, type: "date", message: "Please Select Start Date"},
          ]}
        >
          <DatePicker
            format="YYYY/MM/DD"
            onChange={(e) => {
              setStartDate(e?.toDate());
              form.resetFields(["end_date"]);
            }}
          />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="end_date"
          // disable end date if start date is not selected

          rules={[
            {required: false, type: "date", message: ""},
            //validate end date is greater than start date
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || getFieldValue("start_date") < value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("End date must be greater than start date")
                );
              },
            }),
          ]}
        >
          <DatePicker
            format="YYYY/MM/DD"
            disabled={!form.getFieldValue("start_date") || !startDate}
            // disable dates before start date
            disabledDate={(current) => {
              return current && current < moment(startDate).endOf("day");
            }}
            onChange={(e) => {
              setEndDate(e?.toDate());
              // get total number of days between start and end date
              const days = moment(e?.toDate()).diff(startDate, "days");
              getContributionsTypes(days);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Initial Share"
          name="initial_share"
          rules={[
            {
              required: false,
              type: "number",
              message: "Enter Initial Share!",
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
          label="Interest Rate"
          name="interest_rate"
          rules={[
            {
              required: false,
              type: "number",
              message: "Please input Kikoba Name!",
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
          label="Contribution Amount"
          name="contribution_amount"
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (value > 0) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(
                    "Contribution Amount must be greater than Zero"
                  );
                }
              },
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
          label="Contribution Frequency"
          name="contribution_frequency"
          rules={[
            {required: true, message: "Please Select Contributions Frequency!"},
          ]}
        >
          <Select
            showSearch={true}
            size="large"
            style={{width: "100%"}}
            placeholder="Choose Contribution Frequency ..."
            // disable if end date is not selected
            disabled={!endDate}
            onChange={() => {}}
            filterOption={(input, option: any) => {
              return (
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          >
            {contributionsTypes?.map((contributionType: string) => {
              return (
                <Select.Option
                  value={contributionType}
                  key={"contribution-type-" + contributionType}
                >
                  {/* make contributionType first letter capital */}
                  {contributionType.charAt(0).toUpperCase() +
                    contributionType.slice(1)}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Operation Mode"
          name="payment_mode"
          rules={[
            {required: true, message: "Please Select Operation Payment Mode!"},
          ]}
        >
          <Select
            showSearch={true}
            size="large"
            style={{width: "100%"}}
            placeholder="Choose Operation Payment Mode ..."
            // disable if end date is not selected
            disabled={!endDate}
            onChange={() => {}}
            filterOption={(input, option: any) => {
              return (
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          >
            {payment_modes?.map((payment_mode: any) => {
              return (
                <Select.Option
                  value={payment_mode.key}
                  key={"payment-mode-" + payment_mode.key}
                >
                  {payment_mode.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="allow_client_loan_application" valuePropName="checked">
          <Checkbox>Allow Member Loan Application (self)</Checkbox>
        </Form.Item>

        <Form.Item
          label="Region"
          name="region_id"
          rules={[{required: true, message: "Please Select Region!"}]}
        >
          <Select
            showSearch={true}
            size="large"
            style={{width: "100%"}}
            placeholder="Choose Region ..."
            filterOption={(input, option: any) => {
              return (
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={(value) => {
              getDistricts(value);
              form.resetFields(["district_id"]);
            }}
          >
            {regions?.map((region: RegionData) => {
              return (
                <Select.Option value={region.id} key={"region-" + region.id}>
                  {region.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="District"
          name="district_id"
          rules={[{required: true, message: "Please Select District!"}]}
        >
          <Select
            showSearch={true}
            size="large"
            style={{width: "100%"}}
            placeholder="Choose District ..."
            onChange={() => {}}
            filterOption={(input, option: any) => {
              return (
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          >
            {districts?.map((district: DistrictData) => {
              return (
                <Select.Option
                  value={district.id}
                  key={"district-" + district.id}
                >
                  {district.name}
                </Select.Option>
              );
            })}
          </Select>
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
