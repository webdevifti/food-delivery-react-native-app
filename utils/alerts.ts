import { Alert, AlertButton, Platform } from "react-native";

/**
 * Cross-platform alert. `Alert.alert` is a silent no-op on web, so fall back
 * to window.confirm / window.alert there.
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[],
) {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = [title, message].filter(Boolean).join("\n\n");
  const cancel = buttons?.find((b) => b.style === "cancel");
  const actions = buttons?.filter((b) => b.style !== "cancel") ?? [];

  if (cancel && actions.length > 0) {
    if (window.confirm(text)) actions[0].onPress?.();
    else cancel.onPress?.();
    return;
  }
  window.alert(text);
  actions[0]?.onPress?.();
}

export const comingSoon = (what: string) =>
  showAlert("Coming soon", `${what} will be available soon.`);
