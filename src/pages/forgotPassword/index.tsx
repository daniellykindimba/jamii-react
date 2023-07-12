import { ThemedTitleV2 } from "@refinedev/antd";
import { AuthPage } from "@refinedev/core";
import { AppIcon } from "../../components/app-icon";


export const ForgotPassword = () => {
  return (
    <AuthPage
      type="forgotPassword"
      title={
        <ThemedTitleV2 collapsed={false} text="Kikoba" icon={<AppIcon />} />
      }
    />
  );
};
