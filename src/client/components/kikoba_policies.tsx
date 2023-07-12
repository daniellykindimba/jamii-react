import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Card, Drawer, List, Popconfirm, message} from "antd";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData, KikobaPolicyData} from "../../interfaces";
import {NewKikobaPolicyForm} from "./form/create_kikoba_policy_form";
import {EditKikobaPolicyForm} from "./form/edit_kikoba_policy_form";

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

export const KikobaPoliciesComponent: React.FC<Props> = (props: Props) => {
  const [policies, setPolicies] = useState<KikobaPolicyData[]>([]);
  const [policy, setPolicy] = useState<KikobaPolicyData | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [total, setTotal] = useState(0);

  const handleEdit = (policy: KikobaPolicyData) => {
    setPolicy(policy);
    setEditOpen(true);
  };

  const getKikobaPolicies = async (page: number = 1, limit: number = 25) => {
    const data = await simpleRestProvider.custom!({
      method: "get",
      url:
        configs.apiUrl +
        `/kikoba/policies/${props.kikoba.id}?page=${page}&limit=${limit}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in Getting Kikoba Policies");
        return {data: null};
      });
    if (data.data) {
      setTotal(data.data.pagination.total);
      setPage(data.data.pagination.page);
      setLimit(data.data.pagination.limit);
      setPolicies(data.data.data);
    }
  };

  const deleteKikobaPolicy = async (id: number) => {
    message.destroy();
    const data = await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/policy/delete/${id}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in Deleting Kikoba Policy");
        return {data: null};
      });
    if (data.data) {
      if (data.data.success) {
        message.success(data.data.message);
        getKikobaPolicies();
      } else {
        message.error(data.data.message);
      }
    }
  };

  const onFinish = async () => {
    getKikobaPolicies();
  };

  const onEditFinish = async () => {
    getKikobaPolicies();
    setEditOpen(false);
  };

  useEffect(() => {
    getKikobaPolicies();
  }, [props.kikoba]);

  return (
    <>
      <Card
        title={
          <>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>Policies</span>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
                type="primary"
              >
                Add Policy
              </Button>
            </div>
          </>
        }
      >
        <div
          style={{
            maxHeight: "60vh",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <List
            bordered
            dataSource={policies}
            split={true}
            renderItem={(policy) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleEdit(policy)}
                    icon={<EditOutlined />}
                  ></Button>,

                  <Popconfirm
                    title="Delete the Policy"
                    description="Are you sure to delete this Policy?"
                    onConfirm={() => deleteKikobaPolicy(policy.id)}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" icon={<DeleteOutlined />}></Button>
                  </Popconfirm>,
                ]}
              >
                {policy.content}
              </List.Item>
            )}
          />
        </div>
      </Card>

      <Drawer
        title="Adding New Kikoba Policy"
        placement="right"
        width={"30vw"}
        destroyOnClose={true}
        onClose={() => setOpen(false)}
        open={open}
      >
        <NewKikobaPolicyForm kikoba={props.kikoba} onFinish={onFinish} />
      </Drawer>

      <Drawer
        title="Updating Kikoba Policy"
        placement="right"
        width={"30vw"}
        destroyOnClose={true}
        onClose={() => setEditOpen(false)}
        open={editOpen}
      >
        <EditKikobaPolicyForm
          policy={policy}
          kikoba={props.kikoba}
          onFinish={onEditFinish}
        />
      </Drawer>
    </>
  );
};
