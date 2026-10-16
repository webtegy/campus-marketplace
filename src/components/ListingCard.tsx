import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Listing } from "../types";

export function SoldBadge({
  style,
  textStyle,
}: {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
} = {}) {
  return (
    <View style={[styles.soldBadge, style]}>
      <Text style={[styles.soldText, textStyle]}>SOLD</Text>
    </View>
  );
}

export function ListingCard({
  item,
  saved,
  onSave,
  onOpen,
}: {
  item: Listing;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  const isSold = item.status === "sold";

  return (
    <Pressable
      style={[styles.card, isSold && styles.soldCard]}
      onPress={onOpen}
    >
      {/* IMAGE + OVERLAYS */}
      <View style={styles.photo}>
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* SOLD badge — top left of image */}
        {isSold && <SoldBadge />}

        {/* Price badge — bottom left of image */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>

        {/* Save button — top right */}
        <Pressable
          accessibilityLabel={saved ? "Remove saved item" : "Save item"}
          style={styles.save}
          onPress={onSave}
        >
          <Text style={[styles.heart, saved && styles.red]}>
            {saved ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      {/* CARD BODY */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.condition}>
          {item.condition} · {item.campus}
        </Text>
        <Text style={styles.seller}>Listed by {item.seller}</Text>
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

  soldCard: {
    opacity: 0.6,
  },

  soldBadge: {
    position: "absolute",
    top: 10,
    left: 10,
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

  save: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  heart: { color: "#365B4C", fontSize: 21 },
  red: { color: "#C3535B" },

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
    marginBottom: 3,
  },

  seller: {
    color: "#A0AAA4",
    fontSize: 10,
  },
});
