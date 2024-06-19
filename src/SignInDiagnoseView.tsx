import {
  Icon,
  PrimaryButton,
  Separator,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TextField,
  useTheme,
} from "@fluentui/react";
import axios from "axios";
import * as React from "react";
import { CheckItem } from "./CheckItem";
import { useDoctorState } from "./DoctorStateProvider";
import { EcomConfig } from "./EcomConfig";

const SignInDiagnoseLabel = {
  signInPolicy: "Sign In Policy",
  signInClientId: "Client Id",
  signInStatus: "Sign In",
  signOutStatus: "Sign Out",
  error: "Error",
  retailServerErrorCode: "Retail Err Code",
  retailServerErrorMessage: "Retail Err Msg",
  aud: "Client Id",
  iss: "Issuer",
  family_name: "Last Name",
  given_name: "First Name",
  token: "Token",
};

export const SignInDiagnoseView = ({
  ecomConfig,
  loadingConfig,
}: {
  ecomConfig: EcomConfig | undefined;
  loadingConfig: boolean;
}) => {
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { email, setEmail, pwd, setPwd, signInDiagnose, setSignInDiagnose } =
    useDoctorState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (signInDiagnose && ecomConfig && ecomConfig.url !== signInDiagnose.url) {
      setSignInDiagnose(undefined);
    }
  }, [ecomConfig, signInDiagnose, setSignInDiagnose]);

  const handleDiagnose = () => {
    if (ecomConfig && ecomConfig.signInUrl && ecomConfig.signOutUrl) {
      diagnoseSignInUrl(
        ecomConfig.url,
        ecomConfig.signInUrl,
        ecomConfig.signOutUrl,
        email,
        pwd,
        setSignInDiagnose,
        setLoading
      );
    }
  };

  const handleEmailChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setEmail(newValue || "");
  };

  const handlePasswordChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setPwd(newValue || "");
  };

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
    <Stack tokens={{ childrenGap: 15 }}>
      <Stack
        horizontal
        styles={{
          root: { margin: "0 auto", padding: 20, alignItems: "end" },
        }}
        tokens={{ childrenGap: 15 }}
      >
        <TextField
          label="Email"
          type="email"
          required
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          label="Password"
          type="password"
          required
          value={pwd}
          onChange={handlePasswordChange}
        />
        <PrimaryButton
          text="Diagnose"
          onClick={handleDiagnose}
          disabled={
            loading ||
            !email ||
            !pwd ||
            (signInDiagnose &&
              ecomConfig &&
              ecomConfig.url !== signInDiagnose.url)
          }
        />
      </Stack>
      {signInDiagnose && <SignInDiagnoseResult diagnose={signInDiagnose} />}
      {loading && (
        <Spinner
          label={"Diagnosing Sign-In (take 10-20 seconds)..."}
          size={SpinnerSize.large}
        />
      )}
    </Stack>
  );
};

const SignInDiagnoseResult = ({ diagnose }: { diagnose: any }) => {
  const token = diagnose.token;
  const tokenPayload = diagnose.tokenPayload;

  const azureSuggestion = getAzureSuggestion(diagnose);
  const retailSuggestion = getRetailSuggestion(diagnose);

  return (
    <Stack tokens={{ childrenGap: 5 }}>
      <CheckItem
        label={SignInDiagnoseLabel.signInStatus}
        value={diagnose.signInSucceed ? "Succeed" : "Failed"}
        isValid={!!diagnose.signInSucceed}
      />
      <CheckItem
        label={SignInDiagnoseLabel.signInClientId}
        value={diagnose.signInClientId}
      />
      <CheckItem
        label={SignInDiagnoseLabel.signInPolicy}
        value={diagnose.signInPolicy}
      />
      {diagnose.error && (
        <CheckItem
          label={SignInDiagnoseLabel.error}
          value={diagnose.error}
          isValid={!diagnose.error}
        />
      )}
      {diagnose.retailServerErrorCode && (
        <CheckItem
          label={SignInDiagnoseLabel.retailServerErrorCode}
          value={diagnose.retailServerErrorCode}
          isValid={!diagnose.retailServerErrorCode}
        />
      )}
      {diagnose.retailServerErrorMessage && (
        <CheckItem
          label={SignInDiagnoseLabel.retailServerErrorMessage}
          value={diagnose.retailServerErrorMessage}
          isValid={!diagnose.retailServerErrorMessage}
        />
      )}
      {diagnose.time && <TimeItem diagnose={diagnose} />}
      {tokenPayload && (
        <>
          <CheckItem label={SignInDiagnoseLabel.iss} value={tokenPayload.iss} />
          <CheckItem
            label={"Email"}
            value={tokenPayload?.emails?.join(", ")}
            isValid={diagnose.emails && diagnose.emails.length}
          />

          <CheckItem
            label={SignInDiagnoseLabel.given_name}
            value={tokenPayload.given_name || "Missing"}
            isValid={!!tokenPayload.given_name}
          />
          <CheckItem
            label={SignInDiagnoseLabel.family_name}
            value={tokenPayload.family_name || "Missing"}
            isValid={!!tokenPayload.family_name}
          />
          <CheckItem label={SignInDiagnoseLabel.token} value={token} />
          {/* <CheckItem label={"Token Payload"} value={tokenPayload} /> */}
        </>
      )}
      {(azureSuggestion || retailSuggestion) && (
        <Stack horizontal>
          <Icon iconName="Lightbulb" />
          {azureSuggestion && (
            <Text style={{ wordBreak: "break-all" }} variant={"large"}>
              {azureSuggestion}
            </Text>
          )}
          {retailSuggestion && (
            <Text style={{ wordBreak: "break-all" }} variant={"large"}>
              {retailSuggestion}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};

const getRetailSuggestion = (diagnose: any) => {
  const retailServerErrorCode: string = diagnose.retailServerErrorCode;
  const tokenPayload = diagnose.tokenPayload;
  const iss = tokenPayload?.iss;
  const aud = tokenPayload?.aud;

  let suggestion = "";

  if (
    retailServerErrorCode?.includes(
      "Microsoft_Dynamics_Commerce_Runtime_InvalidAudience"
    ) &&
    iss &&
    aud
  ) {
    suggestion = `Likely HQ  not configure issuer properly, please go to 'Commerce Shared Parameters' and add issuer: '${iss}' with audience: '${aud}'. Then run 1110 Job to sync the CSU.`;
  }

  return suggestion;
};

const getAzureSuggestion = (diagnose: any) => {
  const azureError = diagnose.error;
  const clientId = diagnose.signInClientId;
  const token = diagnose.token;
  const given_name = diagnose.tokenPayload?.given_name;
  const family_name = diagnose.tokenPayload?.family_name;

  let suggestionMessage = "";

  if (azureError?.includes("AADB2C90007")) {
    suggestionMessage = `You got a AADB2C90007 error.
    Please go to your azure tenant, search Azure AD B2C' -> 'App registrations'
    Then find the app with Id ${clientId} -> Go to Authentication Tab -> Add redirect url in format "{site domain}/_msdyn365/authresp"`;
  } else if (token && (!given_name || !family_name)) {
    suggestionMessage = `You are missing first name or family name from your claim.
    Please follow below link to update your userflow to contains 'Given Name' and 'Surname'
    https://learn.microsoft.com/en-us/dynamics365/commerce/dev-itpro/create-user-flow-policies#create-a-sign-up-and-sign-in-user-flow-policy`;
  }

  if (!suggestionMessage) {
    return;
  }

  return suggestionMessage;
};

const diagnoseSignInUrl = async (
  url: string,
  signInUrl: string,
  signOutUrl: string,
  email: string,
  pwd: string,
  onResult: (result: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = {
      signInUrl,
      signOutUrl,
      email,
      pwd,
    };
    const diagnoseResponse = await axios.post(
      `http://localhost:7777/sign-in-diagnose`,
      body
    );

    const diagnose = diagnoseResponse?.data;

    onResult({ ...diagnose, url });
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};

const TimeItem = ({ diagnose }: { diagnose: any }) => {
  const theme = useTheme();

  return (
    <Stack
      horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 10 }}
      style={{ width: "100%", maxWidth: 1200 }}
    >
      <Icon iconName={"AlarmClock"} />
      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 10 }}
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: theme.effects.roundedCorner6,
          boxShadow: theme.effects.elevation8,
          padding: "0 10px",
        }}
      >
        <Text style={{ fontWeight: "bold", width: 100, textAlign: "start" }}>
          Time
        </Text>
        <Separator vertical />
        <Text style={{ wordBreak: "break-all" }}>{diagnose.time} seconds</Text>
      </Stack>
    </Stack>
  );
};
