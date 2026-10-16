import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export function ConfirmModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <Pressable style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,40,33,.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
  },
  title: {
    color: "#173C34",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },
  message: {
    color: "#66736D",
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelText: {
    color: "#83918A",
    fontWeight: "800",
  },
  confirmBtn: {
    backgroundColor: "#C3535B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "800",
  },
});
