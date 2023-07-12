import {AuthBindings} from "@refinedev/core";
import {message} from "antd";
import simpleRestProvider from "./api";
import configs from "./configs";

export const TOKEN_KEY = "kikoba-auth";

export const authProvider: AuthBindings = {
  login: async ({username, email, password}) => {
    if ((username || email) && password) {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const data = await simpleRestProvider.custom!({
        method: "post",
        url: configs.apiUrl + "/login",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        payload: formData,
      })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          message.error("Login Failed, please try again ...");
          return {data: null};
        });

      if (data.data !== null) {
        localStorage.setItem(TOKEN_KEY, data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        var colorMode = data.data.user.interfaceMode
          ? data.data.user.interfaceMode
          : "light";
        // reverse the color mode
        if (colorMode === "light") {
          colorMode = "dark";
        } else {
          colorMode = "light";
        }
        localStorage.setItem("colorMode", colorMode);
        localStorage.setItem("loginAttemp", "0");
        return {
          success: true,
          redirectTo: "/home",
        };
      }
    }
    return {
      success: false,
    };
  },
  logout: async () => {
    // get the color mode
    const colorMode = localStorage.getItem("colorMode");
    localStorage.clear();
    localStorage.setItem("colorMode", colorMode ? colorMode : "light");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    // perform an api call to get the user details
    const data = await fetch(`${configs.apiUrl}/user/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    });

    data
      .json()
      .then(
        (data: {
          success: any;
          id: any;
          first_name: any;
          middle_name: any;
          last_name: any;
          dp: any;
          email: any;
          phone: any;
          interface_mode: any;
          is_admin: any;
          is_staff: any;
        }) => {
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem(
            "colorMode",
            data?.interface_mode ? data.interface_mode : "light"
          );
        }
      );
    const user = localStorage.getItem("user");

    if (user) {
      const data = JSON.parse(user);
      return {
        id: data.id,
        name: `${data.first_name} ${data.middle_name} ${data.last_name}`,
        avatar: data.dp ?? configs.thumbnail,
        email: data.email,
        phone: data.phone,
        interfaceMode: data.interface_mode,
        isAdmin: data.is_admin,
        isStaff: data.is_staff,
      };
    }
  },
  onError: async (error) => {
    return {error};
  },
};
