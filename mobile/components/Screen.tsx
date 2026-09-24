import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = React.PropsWithChildren<{
  scroll?: boolean;
  bottomPadding?: number;
}>;

export function Screen({ children, scroll = true, bottomPadding = 28 }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </SafeAreaView>
  );
}
