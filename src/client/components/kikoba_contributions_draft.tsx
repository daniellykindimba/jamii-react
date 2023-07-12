/* eslint-disable jsx-a11y/anchor-is-valid */
import {CheckOutlined, CloseOutlined, SyncOutlined} from "@ant-design/icons";
import {
  Badge,
  Button,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData, KikobaScheduleData} from "../../interfaces";

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
  randKey: number;
}

export const KikobaContributionsDraftComponent: React.FC<Props> = (
  props: Props
) => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<KikobaScheduleData[]>([]);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      colSpan: 1,
      width: "300px",
      key: "name",
      render: (text: string, record: any) => <>{record.fullName}</>,
    },
    {
      title: "Schedule",
      dataIndex: "schedule",
      key: "schedule",
      render: (text: string, record: any) => {
        if(!record.schedule){
          return <></>
        }
        return record.schedule.map((schedule: any, index: number) => {
          return (
            <>
              <Tooltip
                title={
                  schedule === 0
                    ? "Not Paid/Pending"
                    : schedule === 1
                    ? "Cancelled"
                    : "Paid"
                }
                color={
                  schedule === 0 ? "yellow" : schedule === 1 ? "red" : "green"
                }
              >
                <Tag
                  style={{
                    marginBottom: "10px",
                  }}
                  color={
                    schedule === 0 ? "yellow" : schedule === 1 ? "red" : "green"
                  }
                >
                  {schedule === 0 ? (
                    <>
                      <a
                        onClick={() => {
                          message.info("Updating schedule...");
                        }}
                      >
                        <Badge
                          count={index + 1}
                          size="small"
                          color={
                            schedule === 0
                              ? "yellow"
                              : schedule === 1
                              ? "red"
                              : "green"
                          }
                        >
                          <SyncOutlined
                            style={{
                              fontSize: "20px",
                            }}
                          />
                        </Badge>
                      </a>
                    </>
                  ) : schedule === 1 ? (
                    <>
                      <a
                        onClick={() => {
                          message.info("Updating schedule...");
                        }}
                      >
                        <Badge
                          count={index + 1}
                          size="small"
                          color={
                            schedule === 0
                              ? "yellow"
                              : schedule === 1
                              ? "red"
                              : "green"
                          }
                        >
                          <CloseOutlined
                            style={{
                              fontSize: "20px",
                            }}
                          />
                        </Badge>
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        onClick={() => {
                          message.info("Updating schedule...");
                        }}
                      >
                        <Badge
                          count={index + 1}
                          size="small"
                          color={
                            schedule === 0
                              ? "yellow"
                              : schedule === 1
                              ? "red"
                              : "green"
                          }
                        >
                          <CheckOutlined
                            style={{
                              fontSize: "20px",
                            }}
                          />
                        </Badge>
                      </a>
                    </>
                  )}
                </Tag>
              </Tooltip>
            </>
          );
        });
      },
    },
  ];

  const recalculateSchedule = async () => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!({
      url:
        configs.apiUrl +
        `/kikoba/${props.kikoba.id}/members/recalculate/schedule`,
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
        getSchedule();
      }
    }
    setLoading(false);
  };

  const getSchedule = async () => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/${props.kikoba.id}/schedule`,
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
        setSchedule(data.data);
      }
    }
    setLoading(false);
  };

  const resetSchedule = async () => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/${props.kikoba.id}/schedule/reset`,
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
        getSchedule();
      }
    }
  };

  useEffect(() => {
    getSchedule();
  }, [props.kikoba, props.randKey]);

  return (
    <>
      <span
        style={{display: "flex", justifyContent: "flex-end", marginTop: 10}}
      >
        <Button
          loading={loading}
          onClick={() => {
            recalculateSchedule();
          }}
        >
          Re-calculate
        </Button>
        <Popconfirm
          title="Ressetting The Scheduler"
          description="Are you sure to reset the scheduler?"
          placement="topLeft"
          onConfirm={resetSchedule}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <Button loading={loading} style={{float: "right"}}>
            Reset Schedule
          </Button>
        </Popconfirm>
      </span>
      <div
        style={{
          padding: "0px",
        }}
      >
        <Table
          loading={loading}
          dataSource={schedule}
          columns={columns}
          scroll={{y: "80vh"}}
          pagination={false}
          bordered
        />
      </div>
    </>
  );
};
