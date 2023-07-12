import {useEffect} from "react";

interface Props {
  amount: number|any;
}

export const ThousandsFormatterComponent: React.FC<Props> = (props: Props) => {
  useEffect(() => {}, [props.amount]);

  return (
    <>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "TZS",
      })
        .formatToParts(props.amount)
        .map((p) =>
          p.type !== "literal" && p.type !== "currency" ? p.value : ""
        )
        .join("")}
    </>
  );
};
