/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";
import {useNavigation} from "@refinedev/core";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Dropdown,
  Form,
  Grid,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tag,
  message,
} from "antd";
import type {MenuProps} from "antd";
import moment from "moment";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaExtendedData, KikobaData} from "../../interfaces";
import {NewKikobaForm} from "../components/form/create_new_kikoba_form";
import {UpdateKikobaForm} from "../components/form/update_kikoba_form";
import {KikobaInfosComponent} from "../components/kikoba_infos";
import {CurrencyFormatter} from "../../components/currency/currency_formatter";

interface Props {}

export const ClientVikoba: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [createNewKikoba, setCreateNewKikoba] = useState(false);
  const [editKikobaModal, setEditKikobaModal] = useState(false);
  const [vikoba, setVikoba] = useState<KikobaExtendedData[]>([]);
  const [kikoba, setKikoba] = useState<KikobaData>();
  const [viewKikobaInfosModal, setViewKikobaInfosModal] = useState(false);
  const {push} = useNavigation();
  const breakpoint = Grid.useBreakpoint();
  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  const getVikoba = async (
    key: string = "",
    page: number = 1,
    pageSize: number = 25
  ) => {
    const data = await simpleRestProvider.custom!({
      method: "get",
      url:
        configs.apiUrl +
        `/kikobas/extended?page=${page}&limit=${pageSize}&q=${key}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in getting Vikoba");
        return {data: null};
      });
    if (data.data) {
      setVikoba(data.data.data);
      setTotal(data.data.pagination.total);
      setPage(data.data.pagination.page);
      setLimit(data.data.pagination.limit);
    }
    setLoading(false);
  };

  const deleteKikoba = async (id: number) => {
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${id}/delete`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in Deleting Vikoba");
        return {data: null};
      });
    if (data.data) {
      if (data.data.success) {
        message.success(data.data.message);
        getVikoba("", page, limit);
      } else {
        message.error(data.data.message);
      }
    }
  };

  const handleCreateKikoba = async () => {
    getVikoba("", 1, limit);
    setCreateNewKikoba(false);
  };

  const handleViewingKikobaInfos = async (kikoba: KikobaData) => {
    setKikoba(kikoba);
    setViewKikobaInfosModal(true);
  };

  const handleEditKikobaFinish = async (kikoba: KikobaData) => {
    getVikoba("", page, limit);
    setEditKikobaModal(false);
  };

  //return the component dropdown menu
  const getMenu = (record: any) => {
    const items: MenuProps["items"] = [
      {
        key: "infos",
        label: (
          <Button
            type="link"
            icon={<FolderViewOutlined style={{color: configs.primaryColor}} />}
          >
            View Info's
          </Button>
        ),
        onClick: () => {
          handleViewingKikobaInfos(record);
        },
      },
      {
        key: "edit",
        label: (
          <Button
            type="link"
            icon={<EditOutlined style={{color: configs.primaryColor}} />}
          >
            Edit
          </Button>
        ),
        onClick: () => {
          handleEditKikoba(record);
        },
      },
      {
        key: "delete",
        label: (
          <Popconfirm
            title="Delete this Kikoba?"
            description="Are you sure to delete this Kikoba?"
            onConfirm={() => {
              deleteKikoba(record.id);
            }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              icon={<DeleteOutlined style={{color: configs.primaryColor}} />}
            >
              Delete
            </Button>
          </Popconfirm>
        ),
      },
    ];

    return (
      <Dropdown menu={{items}} trigger={["click"]} placement="bottomRight">
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <DownOutlined style={{color: configs.primaryColor}} />
          </Space>
        </a>
      </Dropdown>
    );
  };

  const handleEditKikoba = async (kikoba: KikobaData) => {
    setKikoba(kikoba);
    setEditKikobaModal(true);
  };

  useEffect(() => {
    getVikoba("", 1, 12);
  }, []);

  return (
    <>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link to={"/home"}>Home</Link>,
          },
          {
            title: "Vikoba",
          },
        ]}
      />

      <div style={{marginTop: 10}}>
        {/* define a search form */}
        <Row>
          {isMobile && (
            <>
              <Col
                span={24}
                style={{display: "flex", justifyContent: "flex-end"}}
              >
                <Button
                  size="large"
                  icon={<FolderAddOutlined />}
                  type="primary"
                  style={{
                    marginRight: 5,
                  }}
                >
                  Join Kikoba
                </Button>
                <Button
                  size="large"
                  icon={<FolderAddOutlined />}
                  onClick={() => setCreateNewKikoba(true)}
                  type="primary"
                >
                  Create Kikoba
                </Button>
              </Col>
              <Col span={24} style={{marginTop: 10}}>
                <Form
                  name="basic"
                  onFinish={(values) => {
                    getVikoba(values.q, 1, limit);
                  }}
                  onFinishFailed={() => {}}
                  autoComplete="off"
                >
                  <Form.Item
                    name="q"
                    rules={[
                      {required: false, message: "Please input your username!"},
                    ]}
                  >
                    <Input
                      size="large"
                      type="search"
                      placeholder="Search ...."
                      allowClear
                    />
                  </Form.Item>
                </Form>
              </Col>
            </>
          )}

          {!isMobile && (
            <>
              <Col span={14}>
                <Form
                  name="basic"
                  onFinish={(values) => {
                    getVikoba(values.q, 1, limit);
                  }}
                  onFinishFailed={() => {}}
                  autoComplete="off"
                >
                  <Form.Item
                    name="q"
                    rules={[
                      {required: false, message: "Please input your username!"},
                    ]}
                  >
                    <Input
                      size="large"
                      type="search"
                      placeholder="Search ...."
                      allowClear
                    />
                  </Form.Item>
                </Form>
              </Col>

              <Col
                span={10}
                style={{display: "flex", justifyContent: "flex-end"}}
              >
                <Button
                  size="large"
                  icon={<FolderAddOutlined />}
                  onClick={() => setCreateNewKikoba(true)}
                  type="primary"
                >
                  Create Kikoba
                </Button>
              </Col>
            </>
          )}
        </Row>
      </div>

      <Spin spinning={loading}>
        <div>
          <Row>
            {vikoba?.length === 0 && !loading && (
              <Col span={24}>
                <Alert message="No Kikoba Found" type="info" />
              </Col>
            )}
            {/* loop through vikoba and display them here */}
            {vikoba?.map((v) => {
              return (
                <Col span={isMobile ? 24 : 8} style={{marginBottom: 10}}>
                  <div
                    style={{
                      margin: 5,
                    }}
                  >
                    <Card
                      title={
                        <>
                          <span>{v.name}</span>
                          <Tag color="green" style={{marginLeft: 5}}>
                            {v.registrationNumber}
                          </Tag>
                          <span style={{float: "right"}}>{getMenu(v)}</span>
                        </>
                      }
                      bordered={false}
                    >
                      <div>
                        <Descriptions bordered size={"small"} column={1}>
                          <Descriptions.Item label="Initial Share">
                            <CurrencyFormatter
                              amount={v.initialShare}
                              currency="TZS"
                            />
                          </Descriptions.Item>
                          <Descriptions.Item label="Contribution Frequency">
                            {v.contributionType}
                          </Descriptions.Item>
                          <Descriptions.Item label="Contribution Amount">
                            <CurrencyFormatter
                              amount={v.contributionAmount}
                              currency="TZS"
                            />
                          </Descriptions.Item>
                          <Descriptions.Item label="Interest Rate">
                            {v.interestRate}
                          </Descriptions.Item>
                          <Descriptions.Item label="Start Date">
                            {moment(v.startDate).format("D/MM/YYYY")}
                          </Descriptions.Item>
                          <Descriptions.Item label="End Date">
                            {moment(v.endDate).format("D/MM/YYYY")}
                          </Descriptions.Item>
                          <Descriptions.Item label="Region/District">
                            {v.region.name}/{v.district.name}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: 10,
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<FolderOpenOutlined />}
                          onClick={() => {
                            //store the kikoba in the local storage
                            localStorage.setItem(
                              "kikoba",
                              JSON.stringify({
                                id: v.id,
                                name: v.name,
                                registrationNumber: v.registrationNumber,
                              })
                            );
                            push(
                              `/vikoba/view/${
                                v.id
                              }/${v.registrationNumber.replace("/", "-")}`
                            );
                          }}
                        >
                          Open
                        </Button>
                      </div>
                    </Card>
                  </div>
                </Col>
              );
            })}
          </Row>

          {!loading && vikoba.length > 0 && (
            <Row>
              <Col
                span={24}
                style={{display: "flex", justifyContent: "center"}}
              >
                <Pagination
                  defaultCurrent={page}
                  total={total}
                  pageSize={limit}
                  current={page}
                  onChange={(page, pageSize) => {
                    getVikoba("", page, pageSize!);
                  }}
                  showSizeChanger
                  onShowSizeChange={(current, size) => {
                    getVikoba("", current, size);
                  }}
                />
              </Col>
            </Row>
          )}
        </div>
      </Spin>

      <Drawer
        title="Creating New Kikoba"
        placement="right"
        width={isMobile ? "100vw" : "40vw"}
        destroyOnClose={true}
        onClose={() => setCreateNewKikoba(false)}
        open={createNewKikoba}
      >
        <NewKikobaForm onFinish={handleCreateKikoba} />
      </Drawer>

      <Drawer
        title="Updating Kikoba"
        placement="right"
        width={isMobile ? "100vw" : "40vw"}
        destroyOnClose={true}
        onClose={() => setEditKikobaModal(false)}
        open={editKikobaModal}
      >
        <UpdateKikobaForm onFinish={handleEditKikobaFinish} kikoba={kikoba} />
      </Drawer>

      <Modal
        title={kikoba?.name + " Info's"}
        width={isMobile ? "100vw" : "80vw"}
        open={viewKikobaInfosModal}
        onOk={() => setViewKikobaInfosModal(false)}
        onCancel={() => setViewKikobaInfosModal(false)}
        footer={[]}
      >
        <KikobaInfosComponent kikoba={kikoba} isMobile={isMobile} />
      </Modal>
    </>
  );
};
