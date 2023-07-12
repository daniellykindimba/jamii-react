/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaMemberData} from "../../interfaces";
import {AddKikobaMemberContributionNameForm} from "./form/add_kikoba_member_contribution_name_form";

const {Text} = Typography;

interface Props {
  member: KikobaMemberData | any;
  onUpdate?: any;
}

export const KikobaMemberContributionNamesComponent: React.FC<Props> = (
  props: Props
) => {
  const [names, setNames] = useState<KikobaMemberData[]>([]);
  const [addName, setAddName] = useState(false);
  const [editContributionName, setEditContributionName] = useState("");
  const [edittedId, setEdittedId] = useState(0);

  let {id} = useParams<{id: string}>();

  const getNames = async (
    start: number,
    key: string = "",
    limit: number = 10
  ) => {
    const {data} = await simpleRestProvider.custom!<KikobaMemberData | any>({
      url:
        configs.apiUrl + `/kikoba/member/${props.member.id}/contribution/names`,
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
          setNames(data.data);
        }
      }
    }
  };

  const deleteName = async (id: number) => {
    const {data} = await simpleRestProvider.custom!({
      url: configs.apiUrl + `/kikoba/member/delete/${id}`,
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
        getNames(1);
        props.onUpdate();
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    }
  };

  const onUpdate = () => {
    getNames(1);
    props.onUpdate();
  };

  const onContributionNameChange = async (name: string) => {
    setEditContributionName(name);
  };

  const updateContributionName = async () => {
    let formData = new FormData();
    formData.append("name", editContributionName);
    const {data} = await simpleRestProvider.custom!({
      url:
        configs.apiUrl + `/kikoba/member/${edittedId}/contribution/name/update`,
      method: "post",
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      if (data.success) {
        getNames(1);
        props.onUpdate();
      }
    }
  };

  useEffect(() => {
    getNames(1);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
          width: "100%",
        }}
      >
        <Button
          onClick={() => setAddName(true)}
          icon={<PlusOutlined style={{color: configs.primaryColor}} />}
        >
          Add New Name
        </Button>
      </div>
      <div
        style={{
          maxHeight: "66vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <List
          bordered
          itemLayout="horizontal"
          dataSource={names}
          renderItem={(name) => {
            var fullName = `${name.member.firstName} ${name.member.middleName} ${name.member.lastName}`;
            return (
              <List.Item
                actions={[
                  <Popconfirm
                    title="Remove Share Contribution Name"
                    style={{width: 300}}
                    placement="topRight"
                    disabled={name.nickname ? false : true}
                    description={
                      <>
                        <p>Are you sure to Remove Contribution Name</p>
                      </>
                    }
                    onConfirm={() => {
                      deleteName(name.id);
                    }}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip
                      title="Delete/Remove Contribution"
                      placement="topRight"
                    >
                      <Button
                        disabled={name.nickname ? false : true}
                        style={{float: "right"}}
                        icon={
                          <CloseOutlined
                            style={{
                              color: configs.primaryColor,
                            }}
                          />
                        }
                        size="small"
                      ></Button>
                    </Tooltip>
                  </Popconfirm>,
                  <Tooltip title="Edit Contribution Name" placement="topRight">
                    <Popconfirm
                      title="Update Contribution Name"
                      description={
                        <>
                          <UpdateKikobaMemberContributionNameComponent
                            id={name.id}
                            name={name}
                            onChange={onContributionNameChange}
                          />
                        </>
                      }
                      disabled={name.nickname ? false : true}
                      placement="topRight"
                      onConfirm={updateContributionName}
                      onCancel={() => {}}
                      onOpenChange={(open) => {
                        if (open) {
                          setEdittedId(name.id);
                          setEditContributionName(name.contributionName);
                        } else {
                          setEdittedId(0);
                          setEditContributionName("");
                        }
                      }}
                      okText="Update"
                      cancelText="No"
                    >
                      <Button
                        disabled={name.nickname ? false : true}
                        style={{float: "right"}}
                        icon={
                          <EditOutlined
                            style={{
                              color: configs.primaryColor,
                            }}
                          />
                        }
                        size="small"
                      ></Button>
                    </Popconfirm>
                  </Tooltip>,
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
                    <>
                      <span style={{display: "block"}}>
                        <a>
                          <Text
                            ellipsis={{
                              tooltip: {
                                placement: "topLeft",
                                title: fullName,
                                color: "green",
                              },
                            }}
                          >
                            {name.contributionName && (
                              <>{name.contributionName}</>
                            )}
                            {!name.contributionName && <>{fullName}</>}

                            {name.nickname && (
                              <>
                                <Tag color="green">{name.nickname}</Tag>
                              </>
                            )}
                          </Text>
                        </a>
                      </span>
                    </>
                  }
                  description=""
                />
              </List.Item>
            );
          }}
        />
      </div>

      <Modal
        title="All Shares/Contributions"
        width={"30vw"}
        open={addName}
        destroyOnClose={true}
        onOk={() => setAddName(false)}
        onCancel={() => setAddName(false)}
        footer={[]}
      >
        <AddKikobaMemberContributionNameForm
          member={props.member}
          onFinish={onUpdate}
        />
      </Modal>
    </>
  );
};

interface UpdateProps {
  id: number;
  name: KikobaMemberData;
  onChange?: any;
}

interface UpdateForm {
  name: string;
}

// define a component for updating a member's contribution name
export const UpdateKikobaMemberContributionNameComponent: React.FC<
  UpdateProps
> = (props: UpdateProps) => {
  const [form] = Form.useForm<UpdateForm>();

  useEffect(() => {
    form.setFieldsValue({
      name: props.name.contributionName,
    });
  }, [props.name]);

  return (
    <>
      <Form<UpdateForm>
        form={form}
        layout="vertical"
        onFinish={(values) => {}}
        onFinishFailed={() => {
          message.error("Please fill all required fields");
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Contribution Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input Kikoba Member Contribution Name!",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter Kikoba Member Contribution Name ..."
            onChange={(e) => {
              props.onChange(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
};
