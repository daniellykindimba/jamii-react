import dataProvider, { axiosInstance } from "@refinedev/simple-rest";
import configs from "./configs";





//httpclient for axiosInstance
axiosInstance.interceptors.request.use(
    (config) => {
        if (config.headers) {
            config.headers["Authorization"] = `Bearer ${localStorage.getItem("kikoba-auth")}`;
        }
        return config;
    }
);


const simpleRestProvider = dataProvider(configs.apiUrl, axiosInstance);

export default simpleRestProvider;