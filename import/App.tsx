
// src/App.tsx

import React from "react";
import { useApp, AppProvider } from "./components/AppContext";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";

// メイン画面プレースホルダー
const MainScreen: React.FC = () => <div>Welcome to the Main Screen</div>;

// 認証状態によって画面分岐
const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case "register":
      return <RegisterScreen />;
    case "login":
      return <LoginScreen />;
    case "main":
      return <MainScreen />;
    default:
      return <LoginScreen />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
