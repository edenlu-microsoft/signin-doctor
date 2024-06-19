import {
  Icon,
  IconButton,
  Pivot,
  PivotItem,
  Stack,
  Text,
  getTheme,
  mergeStyleSets,
} from "@fluentui/react";
import axios from "axios";
import * as React from "react";
import { EcomConfig } from "./EcomConfig";
import { EcomConfigView } from "./EcomConfigView";
import { SignInDiagnoseView } from "./SignInDiagnoseView";

enum PageTab {
  Config = "Config",
  SignIn = "SignIn",
}

const theme = getTheme();
const styles = mergeStyleSets({
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.white,
    borderRadius: theme.effects.roundedCorner6,
    boxShadow: theme.effects.elevation8,
    width: "600px",
    padding: "0 10px",
  },
  input: {
    flexGrow: 1,
    border: "none",
    outline: "none",
    padding: "10px",
    fontSize: "16px",
  },
  iconButton: {
    margin: "0 5px",
  },
});

export default function SearchBar() {
  const [searchValue, setSearchValue] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [ecomConfig, setEcomConfig] = React.useState<EcomConfig | undefined>();
  const [tab, setTab] = React.useState<PageTab>(PageTab.Config);

  const handleSearch = () => {
    setTab(PageTab.Config);
    analyzeWebConfig(searchValue, setEcomConfig, setLoading);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleTabChange = (item?: PivotItem) => {
    setTab(item?.props.itemKey as PageTab);
  };

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      styles={{ root: { flexDirection: "column", alignItems: "center" } }}
    >
      <Stack
        horizontal
        tokens={{ childrenGap: 20 }}
        styles={{
          root: { alignItems: "center", justifyContent: "center", height: 150 },
        }}
      >
        <Icon iconName="Hospital" style={{ fontSize: 50 }} />
        <Text variant={"xxLargePlus"}>Sign-In Doctor</Text>
      </Stack>
      <Stack horizontal className={styles.searchBar}>
        <input
          type="text"
          placeholder="e.g. https://ring1test.adventure-works.com"
          value={searchValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(event.target.value || "");
          }}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        <IconButton
          iconProps={{ iconName: "Search" }}
          className={styles.iconButton}
          ariaLabel="Search"
          onClick={handleSearch}
          disabled={isLoading || !searchValue}
        />
      </Stack>
      <Stack styles={{ root: { marginTop: 20, width: "100%" } }}>
        <Pivot selectedKey={tab} onLinkClick={handleTabChange}>
          <PivotItem headerText="Ecom config" itemKey={PageTab.Config}>
            <EcomConfigView ecomConfig={ecomConfig} loadingConfig={isLoading} />
          </PivotItem>
          <PivotItem headerText="Sign In" itemKey={PageTab.SignIn}>
            <SignInDiagnoseView
              ecomConfig={ecomConfig}
              loadingConfig={isLoading}
            />
          </PivotItem>
        </Pivot>
      </Stack>
    </Stack>
  );
}

const analyzeWebConfig = async (
  url: string,
  onResult: (result: EcomConfig) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const ecomConfig: EcomConfig = { url };
    const requestContextData = await axios.get(
      `http://localhost:7777/ecom-config?ecomUrl=${url}`
    );

    const requestContext = requestContextData?.data;

    if (requestContext) {
      const apiSettings = requestContext.apiSettings;
      ecomConfig.csuEndpoint = apiSettings?.baseUrl;
      ecomConfig.oun = apiSettings?.oun;
      ecomConfig.channelId = apiSettings?.channelId;
      ecomConfig.channelCustomerType = apiSettings?.channelCustomerType;

      const user = requestContext.user;
      if (user?.signInUrl) {
        ecomConfig.signInUrl = `${user.signInUrl}?ru=${url}`;
      }
      ecomConfig.signOutUrl = user?.signOutUrl;
    }

    onResult(ecomConfig);
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};
