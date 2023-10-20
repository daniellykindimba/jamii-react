/* eslint-disable jsx-a11y/anchor-is-valid */
import {CloseOutlined, SearchOutlined} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import {useEffect, useState} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData, KikobaTransactionData} from "../../interfaces";
import {useParams} from "react-router-dom";
import {CurrencyFormatter} from "../../components/currency/currency_formatter";

interface searchFormData {
  key: string;
}

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
  randKey: number;
  height?: string | any;
}

export const KikobaAllSharesTransactionsComponent: React.FC<Props> = (
  props: Props
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const [key, setKey] = useState<string>("");
  const [searchForm] = Form.useForm<searchFormData>();
  const [transactions, setTransactions] = useState<KikobaTransactionData[]>([]);
  let {id} = useParams<{id: string}>();

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => {
        var fullName = `${record.kikobaMember.member.firstName} ${record.kikobaMember.member.middleName} ${record.kikobaMember.member.lastName}`;
        return (
          <>
            {record.kikobaMember.contributionName ? (
              record.kikobaMember.contributionName
            ) : (
              <>
                {fullName}
                {record.kikobaMember.nickname && (
                  <Tag color="green" style={{marginLeft: 5}}>
                    {record.kikobaMember.nickname}
                  </Tag>
                )}
              </>
            )}
          </>
        );
      },
    },
    {
      title: "Added By",
      dataIndex: "addedBy",
      key: "addedby",
      render: (text: string, record: any) => {
        var fullName = `${record.author.firstName} ${record.author.middleName} ${record.author.lastName}`;
        return <>{fullName}</>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdat",
      render: (text: string, record: any) => {
        return (
          <>
            <Tooltip title={moment(record.createdAt).format("LLLL")}>
              {moment(record.createdAt).fromNow()}
            </Tooltip>
          </>
        );
      },
    },
    {
      title: (
        <>
          <span style={{float: "right"}}>Amount</span>
        </>
      ),
      dataIndex: "amount",
      key: "name",
      render: (text: string, record: any) => (
        <span style={{float: "right"}}>
          <CurrencyFormatter amount={record.amount} currency="TZS" />
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: 45,
      render: (text: string, record: any) => {
        return (
          <>
            <Popconfirm
              title="Delete the Transaction"
              description="Are you sure to delete this Transaction?"
              placement="topRight"
              onConfirm={() => {
                deleteTransaction(record.id);
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" icon={<CloseOutlined />} danger></Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const getTransactions = async (
    page: number = 1,
    limit: number = 25,
    key: string = ""
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!({
      url:
        configs.apiUrl +
        `/kikoba/${id}/members/contributions?limit=${limit}&page=${page}&q=${key}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });
    if (data) {
      if (data.success) {
        setTotal(data.pagination.total);
        setLimit(data.pagination.limit);
        setPage(data.pagination.page);
        setTransactions(data.data);
      }
    }
    setLoading(false);
  };

  const deleteTransaction = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/contribution/${id}/delete`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });
    if (data) {
      if (data.success) {
        getTransactions(page, limit, key);
        props.onUpdate();
      }
    }
  };

  useEffect(() => {
    getTransactions();
  }, [props.randKey]);

  return (
    <>
      <Card>
        <Row style={{marginTop: 10}}>
          <Col span={12}>
            <Form<searchFormData>
              layout="vertical"
              form={searchForm}
              onFinish={(values) => {
                setKey(values.key);
                getTransactions(page, limit, values.key);
              }}
            >
              <Form.Item name="key">
                <Input
                  size="large"
                  placeholder="Search ..."
                  prefix={<SearchOutlined />}
                  autoComplete="off"
                  allowClear
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Table
          loading={loading}
          size="small"
          dataSource={transactions}
          columns={columns}
          scroll={{y: props.height ? props.height + "vh" : "50vh"}}
          pagination={{
            total: total,
            pageSize: limit,
            onChange: (page, limit) => {
              setPage(page);
              setLimit(limit);
              getTransactions(page, limit, key);
            },
          }}
          bordered
        />
      </Card>
    </>
  );
};
