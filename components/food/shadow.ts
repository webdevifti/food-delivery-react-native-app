import { Platform, ViewStyle } from "react-native";

/** Soft card shadow shared by food cards and category chips. */
export const softShadow: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: "#6C7A9C",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  android: { elevation: 6, shadowColor: "#6C7A9C" },
  default: {
    shadowColor: "#6C7A9C",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
})!;
