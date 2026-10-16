import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Listing } from "../types";

export function MyListingCard({
  item,
  onOpen,
  onEdit,
  onDelete,
}: {
  item: Listing;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onOpen}>
      <View style={styles.photo}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
        {item.status === 'sold' && (
          <View style={styles.soldBadge}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.condition}>
          {item.condition} · {item.campus}
        </Text>
        
        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} onPress={onEdit}>
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E9ECE6",
  },
  photo: {
    height: 148,
    backgroundColor: "#E5ECE5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  priceBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "#1F5D4C",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priceText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  soldBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#C3535B",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  soldText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },
  body: {
    padding: 12,
  },
  title: {
    color: "#1B3A33",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  condition: {
    color: "#87918C",
    fontSize: 11,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#F4F9F6',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECE6',
  },
  actionText: {
    color: '#1F5D4C',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#FBECEE',
    borderColor: '#FBECEE',
  },
  deleteText: {
    color: '#C3535B',
    fontSize: 12,
    fontWeight: '700',
  },
});
