/* eslint-disable jsx-a11y/anchor-is-valid */
import {Col, Form, Input, Row, Table, Tooltip, Typography} from "antd";
import moment from "moment";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaLoanRepaymentData} from "../../interfaces";
const {Text} = Typography;

interface Props {
  min?: boolean;
  limit?: number;
  onUpdate?: any;
}

export const UserLoanRepaymentsComponent: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [repayments, setRepayments] = useState<KikobaLoanRepaymentData[]>([]);

  let {id} = useParams<{id: string}>();

  const columns = [
    {
      title: "Kikoba Name",
      dataIndex: "name",
      key: "name",
      render: (text: any, record: any) => {
        return (
          <Tooltip title={record.kikoba.name}>
            <Text strong>{record.kikoba.name}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: "Contribution Name",
      dataIndex: "contributionName",
      key: "contributionName",
      render: (text: any, record: any) => {
        if (record.loanRequest.kikobaMember.contributionName.length > 0) {
          return (
            <Text>{record.loanRequest.kikobaMember.contributionName}</Text>
          );
        } else {
          return (
            <Text>
              {record.loanRequest.kikobaMember.member.firstName}{" "}
              {record.loanRequest.kikobaMember.member.middleName}{" "}
              {record.loanRequest.kikobaMember.member.lastName}
            </Text>
          );
        }
      },
    },
    {
      title: (
        <div
          style={{
            float: "right",
          }}
        >
          Amount
        </div>
      ),
      dataIndex: "amount",
      key: "amount",
      render: (text: any, record: any) => {
        return (
          <div style={{float: "right"}}>
            <Text strong>
              {record.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: any, record: any) => {
        return <Text>{moment(record.createdAt).format("DD/MM/YYYY")}</Text>;
      },
    },
  ];

  const getRepayments = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<
      KikobaLoanRepaymentData | any
    >({
      url:
        configs.apiUrl +
        `/user/loan/repayments?page=${start}&limit=${limit}&search=${key}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      if (data.success) {
        if (data.data) {
          setTotal(data.pagination.total);
          setLimit(data.pagination.limit);
          setPage(data.pagination.page);
          setRepayments(data.data);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (props.min) {
      getRepayments(1, "", props.limit);
    } else {
      getRepayments(1);
    }
  }, []);

  return (
    <>
      {!props.min && (
        <Row>
          <Col span={14}>
            <Form
              name="basic"
              onFinish={(values) => {
                setKey(values.q);
                getRepayments(1, values.q, limit);
              }}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                name="q"
                rules={[{required: false, message: "Search ...!"}]}
              >
                <Input
                  size="large"
                  type="search"
                  placeholder="Search ...."
                  allowClear
                  onChange={(e) => {
                    if (!e.target.value) {
                      getRepayments(1);
                    }
                  }}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      )}
      <Table
        loading={loading}
        dataSource={repayments}
        columns={columns}
        scroll={{
          y: "70vh",
        }}
        pagination={
          props.min
            ? false
            : {
                pageSize: limit,
                total: total,
                current: page,
                onChange(page, pageSize) {
                  console.log(page);
                  getRepayments(page, key, pageSize);
                },
              }
        }
      />
    </>
  );
};
