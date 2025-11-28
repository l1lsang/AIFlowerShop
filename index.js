import { Redirect } from "expo-router";
console.log("🔥 index.js loaded!");

export default function Index() {
  return <Redirect href="/auth/login" />;
}
