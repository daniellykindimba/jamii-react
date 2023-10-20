/* eslint-disable jsx-a11y/anchor-is-valid */
import {Col, Form, Input, Row, Table, Tooltip, Typography} from "antd";
import moment from "moment";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaContributionData} from "../../interfaces";
import {CurrencyFormatter} from "../../components/currency/currency_formatter";
const {Text} = Typography;

interface Props {
  min?: boolean;
  limit?: number;
  onUpdate?: any;
}

export const UserContributionsComponent: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [contributions, setContributions] = useState<KikobaContributionData[]>(
    []
  );

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
        if (record.kikobaMember.contributionName.length > 0) {
          return <Text>{record.kikobaMember.contributionName}</Text>;
        } else {
          return (
            <Text>
              {record.kikobaMember.member.firstName}{" "}
              {record.kikobaMember.member.middleName}{" "}
              {record.kikobaMember.member.lastName}
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
            <CurrencyFormatter currency="TZS" amount={record.amount} />
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

  const getContributions = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<
      KikobaContributionData | any
    >({
      url:
        configs.apiUrl +
        `/user/donations?page=${start}&limit=${limit}&search=${key}`,
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
          setContributions(data.data);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (props.min) {
      getContributions(1, "", props.limit);
    } else {
      getContributions(1);
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
                getContributions(1, values.q, limit);
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
                      getContributions(1);
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
        dataSource={contributions}
        columns={columns}
        scroll={{
          y: "70vh",
        }}
        pagination={
          props.min
            ? false
            : {
                current: page,
                pageSize: limit,
                total: total,
              }
        }
      />
    </>
  );
};
