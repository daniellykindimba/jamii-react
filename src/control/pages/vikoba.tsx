import {SearchOutlined} from "@ant-design/icons";
import {useActiveAuthProvider, useGetIdentity} from "@refinedev/core";
import {Button, Col, Form, Grid, Input, Modal, Row, Table} from "antd";
import {useEffect, useState} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData, RegionData} from "../../interfaces";
import {get} from "http";
import moment from "moment";

interface Props {}

interface searchFormData {
  key: string;
}

export const ControlVikoba: React.FC<Props> = (props: Props) => {
  const [vikobas, setVikobas] = useState<KikobaData[]>([]);
  const [kikoba, setKikoba] = useState<KikobaData>();
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [kikobaModal, setKikobaModal] = useState(false);
  const [searchForm] = Form.useForm<searchFormData>();
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  const handleKikobaModal = (kikoba: KikobaData) => {
    setKikoba(kikoba);
    setKikobaModal(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: true,
    },
    {
      title: "Kikoba #",
      dataIndex: "kikobaNumber",
      key: "kikobaNumber",
      render: (text: any, row: any, index: any) => (
        <>
          <span>{row.registrationNumber}</span>
        </>
      ),
    },
    {
      title: "Region/District",
      dataIndex: "region",
      key: "region",
      render: (text: any, row: any, index: any) => (
        <>
          <span>
            {row.region.name}/{row.district.name}
          </span>
        </>
      ),
    },
    {
      title: "start Date - End Date",
      dataIndex: "region",
      key: "region",
      render: (text: any, row: any, index: any) => (
        <>
          <span>
            {moment(row.startDate).format("MM/DD/YYYY")} -{" "}
            {moment(row.endDate).format("MM/DD/YYY")}
          </span>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, row: any, index: any) => (
        <>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              handleKikobaModal(row);
            }}
            style={{float: "right"}}
          >
            View
          </Button>
        </>
      ),
    },
  ];

  const getVikobas = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url:
        configs.apiUrl + `/kikobas/all?page=${start}&limit=${limit}&q=${key}`,
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
      setVikobas(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if ((user?.isAdmin || user?.isStaff) === false) {
      window.location.href = "/";
    }
    getVikobas(1);
  }, []);

  return (
    <>
      <Row style={{marginTop: 10}}>
        <Col span={isMobile ? 24 : 12}>
          <Form<searchFormData>
            layout="vertical"
            form={searchForm}
            onFinish={(values) => {}}
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
        dataSource={vikobas}
        columns={columns}
        scroll={{x: true}}
        pagination={{
          total: total,
          pageSize: limit,
          current: page,
        }}
      />

      <Modal
        title={kikoba?.name + " - " + kikoba?.registrationNumber + " Details"}
        width={"90vw"}
        open={kikobaModal}
        onOk={() => {
          setKikobaModal(false);
        }}
        onCancel={() => {
          setKikobaModal(false);
        }}
        footer={[]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};
