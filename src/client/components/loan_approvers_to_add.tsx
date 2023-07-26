/* eslint-disable jsx-a11y/anchor-is-valid */
import {PlusOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar, Button, List, Popconfirm, message} from "antd";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaMemberData, RegionData} from "../../interfaces";

interface Props {
  kikoba: number | any;
  onAdd?: any;
}

export const LoansApproversToAddComponent: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<KikobaMemberData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchKey, setSearchKey] = useState("");

  const getApprovers = async (
    start: number,
    key: string = "",
    limit: number = 25
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url:
        configs.apiUrl +
        `/kikoba/${props.kikoba}/members/not/loan/approver?page=${start}&limit=${limit}&q=${key}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });

    if (data) {
      if (data.data) {
        setTotal(data.pagination.total);
        setPage(data.pagination.page);
        setLimit(data.pagination.limit);
        setMembers(data.data);
      }
    }
    setLoading(false);
  };

  const addApprover = async (member: number) => {
    message.destroy();
    const {data} = await simpleRestProvider.custom!<RegionData | any>({
      url:
        configs.apiUrl + `/kikoba/${props.kikoba}/loan/approver/${member}/add`,
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
        message.success("Approver added successfully");
        getApprovers(page, searchKey, limit);
        props.onAdd();
      } else {
        message.error("Failed to add approver");
      }
    }
  };

  useEffect(() => {
    getApprovers(page, "", 25);
  }, [props.kikoba]);

  return (
    <>
      <List
        size="small"
        bordered
        dataSource={members.filter(
          (member) => member.contributionName.length === 0
        )}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Popconfirm
                title={
                  "Add '" +
                  item.member.firstName +
                  " " +
                  item.member.middleName +
                  " " +
                  item.member.lastName +
                  "' " +
                  " as approver?"
                }
                description="Are you sure?"
                placement="topRight"
                onConfirm={() => addApprover(item.id)}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<PlusOutlined />}></Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: configs.primaryColor,
                  }}
                />
              }
              title={
                <a>
                  {item.member.firstName} {item.member.middleName}{" "}
                  {item.member.lastName}
                </a>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
