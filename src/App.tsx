import { Stack, initializeIcons } from "@fluentui/react";
import "./App.css";
import { DoctorStateProvider } from "./DoctorStateProvider";
import SearchBar from "./SearchBar";
initializeIcons();
function App() {
  return (
    <Stack style={{ alignItems: "center" }}>
      <DoctorStateProvider>
        <SearchBar />
      </DoctorStateProvider>
    </Stack>
  );
}

export default App;
