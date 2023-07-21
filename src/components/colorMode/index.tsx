/* eslint-disable jsx-a11y/anchor-is-valid */
import {Switch} from "antd";
import {useContext} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import simpleRestProvider from "../../api";
import configs from "../../configs";

//a functional component
const ColorModeComponent = () => {
  const {mode, setMode} = useContext(ColorModeContext);

  const updateColorMode = async (mode: string) => {
    const formData = new FormData();
    formData.append("mode", mode);
    await simpleRestProvider.custom!({
      method: "post",
      url: configs.apiUrl + "/user/interface/color/mode",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      payload: formData,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return {data: null};
      });
  };

  return (
    <Switch
      checkedChildren="🌛"
      unCheckedChildren="🔆"
      onChange={() => {
        setMode(mode === "light" ? "dark" : "light");
        try {
          updateColorMode(mode === "light" ? "dark" : "light");
        } catch (error) {}
      }}
      defaultChecked={mode === "dark"}
    />
  );
};

export default ColorModeComponent;
