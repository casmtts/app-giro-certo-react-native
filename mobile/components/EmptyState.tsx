import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center px-8 py-14">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-copper-wash">
        <MaterialCommunityIcons name="motorbike" size={30} color="#A84F26" />
      </View>
      <Text className="text-center text-lg font-jakarta-bold text-ink">{title}</Text>
      <Text className="mt-2 text-center leading-6 text-muted">{message}</Text>
      {actionLabel && onAction && (
        <Button mode="outlined" onPress={onAction} className="mt-5 border-line">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
