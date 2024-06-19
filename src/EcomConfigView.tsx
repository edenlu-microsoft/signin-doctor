import {
  Icon,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  useTheme,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { CheckItem } from "./CheckItem";
import { EcomConfig } from "./EcomConfig";
import { diagnoseCSU } from "./diagnoseCSU";

const EcomConfigLabel: { [key: string]: string } = {
  csuEndpoint: "CSU Endpoint",
  oun: "OUN",
  channelId: "Channel Id",
  channelCustomerType: "Channel Type",
  signInUrl: "SignIn Url",
  signOutUrl: "SignOut Url",
};

const EcomConfigKeys = [
  "channelCustomerType",
  "oun",
  "channelId",
  "csuEndpoint",
  "signInUrl",
  "signOutUrl",
];

export const EcomConfigView = ({
  ecomConfig,
  loadingConfig,
}: {
  ecomConfig: EcomConfig | undefined;
  loadingConfig: boolean;
}) => {
  const theme = useTheme();
  const [loadingCSU, setLoadingCSU] = useState(false);
  const [diagnoseCSU, setDiagnoseCSU] = useState<any>();

  useEffect(() => {
    const csuEndpoint = ecomConfig?.csuEndpoint;
    const oun = ecomConfig?.oun;
    const channelId = ecomConfig?.channelId;
    if (
      !loadingConfig &&
      !loadingCSU &&
      csuEndpoint &&
      oun &&
      channelId &&
      ecomConfig.url !== diagnoseCSU?.url
    ) {
      diagnoseCSURequest(
        csuEndpoint,
        oun,
        channelId,
        ecomConfig.url,
        setDiagnoseCSU,
        setLoadingCSU
      );
    }
  }, [
    ecomConfig,
    loadingCSU,
    setLoadingCSU,
    diagnoseCSU,
    setDiagnoseCSU,
    loadingConfig,
  ]);

  if (!ecomConfig || loadingConfig) {
    return (
      <Stack
        style={{
          height: 100,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
          border: "5px dashed #d3d3d3",
          borderRadius: 10,
        }}
      >
        {loadingConfig && (
          <Spinner label={"Loading config..."} size={SpinnerSize.large} />
        )}
        {!loadingConfig && (
          <Text color={theme.palette.neutralSecondary}>
            Enter url to start diagnose
          </Text>
        )}
      </Stack>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 5 }}>
      {EcomConfigKeys.map((key) => {
        const label: string = EcomConfigLabel[key];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (ecomConfig as any)[key] as string;

        return <CheckItem key={key} label={label} value={value} />;
      })}

      {loadingCSU && (
        <Spinner label={"Loading CSU calls..."} size={SpinnerSize.large} />
      )}
      {!loadingCSU && diagnoseCSU && (
        <>
          {
            <CheckItem
              label={"SearchByCriteria"}
              value={
                diagnoseCSU?.searchByCriteria
                  ? diagnoseCSU.searchByCriteria
                  : "Succeed"
              }
              isValid={!diagnoseCSU?.searchByCriteria}
            />
          }
        </>
      )}
      <EcomConfigSuggestion ecomConfig={ecomConfig} />
    </Stack>
  );
};

const EcomConfigSuggestion = ({
  ecomConfig,
}: {
  ecomConfig: EcomConfig | undefined;
}) => {
  if (!ecomConfig) {
    return;
  }

  let suggestion = "";

  if (!ecomConfig.channelCustomerType && !ecomConfig.csuEndpoint) {
    suggestion =
      "The website cannot find its CSU endpoint of this channel, please check Tenant config and marketSettings at CMS editor";
  }

  if (!suggestion) {
    return;
  }

  return (
    <Stack horizontal tokens={{ childrenGap: 10 }}>
      <Icon iconName="Lightbulb" color="yellow" />
      <Text variant={"large"}>{suggestion}</Text>
    </Stack>
  );
};

const diagnoseCSURequest = async (
  csuEndpoint: string,
  oun: string,
  channelId: number,
  url: string,
  onResult: (result: EcomConfig) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const diagnoseResult = await diagnoseCSU(csuEndpoint, oun, channelId);
    onResult({ ...diagnoseResult, url });
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};
