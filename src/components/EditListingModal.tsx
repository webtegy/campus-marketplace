import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Listing } from "../types";

export function EditListingModal({
  listing,
  visible,
  onClose,
  onSubmit,
}: {
  listing: Listing | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (id: string, title: string, price: string) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listing && visible) {
      setTitle(listing.title);
      setPrice(listing.price.toString());
    }
  }, [listing, visible]);

  const handleSave = async () => {
    if (!listing) return;
    setLoading(true);
    await onSubmit(listing.id, title, price);
    setLoading(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Listing</Text>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            editable={!loading}
          />
          <View style={styles.buttons}>
            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
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
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },
  label: {
    color: "#365B4C",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDE4DC",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#173C34",
    marginBottom: 20,
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
  saveBtn: {
    backgroundColor: "#1F5D4C",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "800",
  },
});
