/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {DeleteOutlined, UserOutlined} from "@ant-design/icons";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Form,
  List,
  Popconfirm,
  Spin,
  Tag,
  message,
} from "antd";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../../../api";
import configs from "../../../../configs";
import {
  DonationData,
  DonationPaymentData,
  RegionData,
} from "../../../../interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import {CurrencyFormatter} from "../../../../components/currency/currency_formatter";
interface RegionsSearchFormData {
  key: string;
}

interface RegionFormData {
  name: string;
}

interface Props {
  randKey?: any;
  onUpdate?: any;
  donation?: DonationData;
}

export const DonationsComponent: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [payments, setPayments] = useState<DonationPaymentData[]>([]);
  const [payment, setPayment] = useState<DonationPaymentData>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const {push} = useNavigation();
  const [editDonationModal, setEditDonationModal] = useState(false);
  const [searchForm] = Form.useForm<RegionsSearchFormData>();
  const [form] = Form.useForm<RegionFormData>();

  const confirmDelete = async (id: number) => {
    await simpleRestProvider.custom!({
      url: configs.apiUrl + `/donation/payment/${id}/delete`,
      method: "get",
    })
      .then((res) => {
        if (res.data.success) {
          if (res.data.success) {
            setPayments(payments.filter((pay) => pay.id !== id));
            setTotal(total - 1);
            message.success(res.data.message);
          }
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const getPayments = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url:
        configs.apiUrl +
        `/donation/${props.donation?.id}/payments?page=${start}&limit=${limit}&q=${key}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });

    if (data) {
      setTotal(data.pagination.total);
      setPage(data.pagination.page);
      setLimit(data.pagination.limit);
      setPayments(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPayments(page, "", 25);
  }, [props.randKey]);

  return (
    <>
      <Card title="Donations">
        <Spin spinning={loading}>
          <InfiniteScroll
            dataLength={total}
            next={() => getPayments(page + 1, searchKey, limit)}
            hasMore={total > payments.length}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{textAlign: "center"}}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={() => getPayments(1, searchKey, limit)}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
          >
            <List
              dataSource={payments}
              renderItem={(payment) => (
                <List.Item
                  key={payment.user.phone}
                  extra={[
                    <Popconfirm
                      title={"Are you sure to delete this Payment?"}
                      onConfirm={() => confirmDelete(payment?.id)}
                      onCancel={() => {}}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        disabled={props.donation?.user.id !== user?.id}
                        type="primary"
                        icon={<DeleteOutlined />}
                        style={{marginRight: 3}}
                      ></Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <a>
                        {payment.user.fullName}
                        <Tag style={{marginLeft: 5}} color="green">
                          <CurrencyFormatter
                            amount={payment.amount}
                            currency="TZS"
                          />
                        </Tag>
                      </a>
                    }
                    description={payment.user.phone}
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </Spin>
      </Card>
    </>
  );
};
