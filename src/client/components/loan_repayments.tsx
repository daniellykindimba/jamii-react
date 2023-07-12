/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaLoanData, KikobaLoanRepaymentData} from "../../interfaces";
import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import moment from "moment";
import {ThousandsFormatterComponent} from "./thousands_formatter";

interface Props {
  loan: KikobaLoanData | any;
  onUpdate?: any;
}

export const LoanRepaymentsComponent: React.FC<Props> = (props: Props) => {
  const [repayments, setRepayments] = useState<KikobaLoanRepaymentData[]>([]);
  const [addRepaymentModal, setAddRepaymentModal] = useState<boolean>(false);

  const getRepayments = async () => {
    await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/member/loan/${props.loan.id}/repayments`,
    })
      .then((res) => {
        setRepayments(res.data.data);
      })
      .catch((err) => {
        return {data: null};
      });
  };

  const deleteRepayment = async (id: number) => {
    await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/loan/repayment/${id}/delete`,
    })
      .then((res) => {
        props.onUpdate();
        message.success("Repayment Deleted Successfully");
        getRepayments();
      })
      .catch((err) => {
        message.error("Error in deleting repayment");
      });
  };

  const onUpdate = async () => {
    getRepayments();
    setAddRepaymentModal(false);
    props.onUpdate();
  };

  const columns = [
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: any, record: any) => (
        <Space size="middle">
          {moment(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}
        </Space>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: any, record: any) => {
        return (
          <>
            <ThousandsFormatterComponent amount={record.amount} />
          </>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (text: any, record: any) => (
        <span>
          <Popconfirm
            title="Delete the repayment?"
            description="Are you sure to delete this repayment?"
            placement="topRight"
            onConfirm={() => deleteRepayment(record.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{float: "right"}}
              danger
            ></Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  useEffect(() => {
    getRepayments();
  }, [props.loan]);

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        style={{
          marginBottom: 5,
          float: "right",
        }}
        onClick={() => setAddRepaymentModal(true)}
      >
        Add Repayment
      </Button>
      <Table columns={columns} dataSource={repayments} />

      <Modal
        title="Adding Repayment"
        open={addRepaymentModal}
        destroyOnClose={true}
        onOk={() => setAddRepaymentModal(false)}
        onCancel={() => setAddRepaymentModal(false)}
        footer={[]}
      >
        <AddRepaymentFormComponent loan={props.loan} onUpdate={onUpdate} />
      </Modal>
    </>
  );
};

interface formData {
  amount: number;
}

interface AddProps {
  loan: KikobaLoanData | any;
  onUpdate?: any;
}

const AddRepaymentFormComponent: React.FC<AddProps> = (props: AddProps) => {
  const [form] = Form.useForm<formData>();

  const createRepayment = async (values: formData) => {
    message.destroy();
    let formData = new FormData();
    formData.append("amount", values.amount.toString());

    const data = await simpleRestProvider.custom!({
      method: "post",
      url:
        configs.apiUrl + `/kikoba/member/loan/${props.loan.id}/repayment/add`,
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        message.error("Error in creating Kikoba");
        return {data: null};
      });
    if (data.data) {
      if (data.data.success) {
        props.onUpdate();
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
          createRepayment(values);
        }}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Repayment Amount"
          name="amount"
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (value > 0) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(
                    "Repayment Amount must be greater than Zero"
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
          <Button type="primary" htmlType="submit" style={{float: "right"}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
