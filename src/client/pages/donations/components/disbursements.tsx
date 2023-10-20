/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {DeleteOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";
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
  Grid,
  List,
  Modal,
  Popconfirm,
  Spin,
  Tag,
} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../../../api";
import configs from "../../../../configs";
import {
  DonationData,
  DonationDisbursementData,
  RegionData,
} from "../../../../interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import {CreatingDonationDisbursementForm} from "./form/creating_dibursement_form";
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

export const DonationDisbursementsComponent: React.FC<Props> = (
  props: Props
) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [disbursement, setDisbursement] = useState<DonationDisbursementData>();
  const [disbursements, setDisbursements] = useState<
    DonationDisbursementData[]
  >([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const {push} = useNavigation();
  const [createDisbursementModal, setCreateDisbursementModal] = useState(false);
  const [searchForm] = Form.useForm<RegionsSearchFormData>();
  const [form] = Form.useForm<RegionFormData>();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  let {id} = useParams<{id: string}>();

  const getDisbursements = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url:
        configs.apiUrl +
        `/donation/${props.donation?.id}/disbursements?page=${start}&limit=${limit}&q=${key}`,
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
      setDisbursements(data.data);
    }
    setLoading(false);
  };

  const onUpdate = () => {
    getDisbursements(page, searchKey, limit);
    setCreateDisbursementModal(false);
    props.onUpdate();
  };

  useEffect(() => {
    getDisbursements(page, "", 25);
  }, [props.randKey]);

  return (
    <>
      <Card
        title="Dibursements"
        extra={[
          <Button
            disabled={props.donation?.user.id !== user?.id}
            icon={<PlusOutlined />}
            onClick={() => setCreateDisbursementModal(true)}
          >
            Create Disbursement
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <InfiniteScroll
            dataLength={total}
            next={() => getDisbursements(page + 1, searchKey, limit)}
            hasMore={total > disbursements.length}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{textAlign: "center"}}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={() => getDisbursements(1, searchKey, limit)}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
          >
            <List
              dataSource={disbursements}
              renderItem={(disbursement) => (
                <List.Item
                  key={disbursement.user.phone}
                  extra={[
                    <Popconfirm
                      title={"Are you sure to delete this Disbursement?"}
                      onConfirm={() => {}}
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
                        {disbursement.user.fullName}
                        <Tag style={{marginLeft: 5}} color="green">
                          <CurrencyFormatter
                            amount={disbursement.amount}
                            currency="TZS"
                          />
                        </Tag>
                      </a>
                    }
                    description={disbursement.user.phone}
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </Spin>
      </Card>

      <Modal
        title={"Create Disbursement for " + props.donation?.title}
        open={createDisbursementModal}
        destroyOnClose={true}
        onOk={() => {
          setCreateDisbursementModal(false);
        }}
        onCancel={() => {
          setCreateDisbursementModal(false);
        }}
        footer={[]}
      >
        <CreatingDonationDisbursementForm
          donation={props.donation}
          onUpdate={onUpdate}
        />
      </Modal>
    </>
  );
};
