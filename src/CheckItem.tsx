import { Icon, Separator, Stack, Text, useTheme } from "@fluentui/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CheckItem = ({
  label,
  value,
  isValid,
}: {
  label: string;
  value: any;
  isValid?: boolean;
}) => {
  const theme = useTheme();

  const valid = isValid ?? !!value;

  return (
    <Stack
      horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 10 }}
      style={{ width: "100%", maxWidth: 1200 }}
    >
      <Icon
        iconName={valid ? "BoxCheckmarkSolid" : "WarningSolid"}
        styles={{ root: { color: valid ? "green" : "red" } }}
      />
      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 10 }}
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          backgroundColor: theme.palette.white,
          borderRadius: theme.effects.roundedCorner6,
          boxShadow: theme.effects.elevation8,
          padding: "0 10px",
        }}
      >
        <Text style={{ fontWeight: "bold", width: 100, textAlign: "start" }}>
          {label}
        </Text>
        <Separator vertical />
        <Text style={{ wordBreak: "break-all" }}>{value || "Missing"}</Text>
      </Stack>
    </Stack>
  );
};
