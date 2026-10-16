import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ListingCard } from "../components/ListingCard";
import { categories } from "../data";
import { Listing } from "../types";

export function ExplorePage({
  items,
  query,
  category,
  priceFilter,
  priceSort,
  savedIds,
  onQueryChange,
  onCategoryChange,
  onPriceFilterChange,
  onPriceSortChange,
  onSave,
  onOpen,
  onProfile,
}: {
  items: Listing[];

  query: string;

  category: string;

  priceFilter: string;

  priceSort: string;

  savedIds: string[];

  onQueryChange: (
    value: string,
  ) => void;

  onCategoryChange: (
    value: string,
  ) => void;

  onPriceFilterChange: (
    value: string,
  ) => void;

  onPriceSortChange: (
    value: string,
  ) => void;

  onSave: (id: string) => void;

  onOpen: (item: Listing) => void;

  onProfile: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={
        styles.content
      }
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            CAMPUS MARKETPLACE
          </Text>

          <Text style={styles.heading}>
            Find your next{"\n"}
            favorite thing.
          </Text>
        </View>

        <Pressable
          style={styles.avatar}
          onPress={onProfile}
        >
          <Text style={styles.avatarText}>
            ?
          </Text>
        </Pressable>
      </View>

      {/* SEARCH */}

      <View style={styles.search}>
        <Text style={styles.icon}>
          ⌕
        </Text>

        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search textbooks, desks, tech..."
          placeholderTextColor="#87918C"
          style={styles.input}
        />
      </View>

      {/* SECTION */}

      <View style={styles.section}>
        <View>
          <Text
            style={styles.sectionTitle}
          >
            Browse near you
          </Text>

          <Text style={styles.muted}>
            Good finds, close by
          </Text>
        </View>

        <Text style={styles.seeAll}>
          {items.length} items
        </Text>
      </View>

      {/* CATEGORY */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.categories
        }
      >
        {categories.map((value) => (
          <Pressable
            key={value}
            onPress={() =>
              onCategoryChange(value)
            }
            style={[
              styles.category,
              category === value &&
                styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === value &&
                  styles.activeText,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* PRICE FILTER */}

      <Text style={styles.filterTitle}>
        Filter by price
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.priceCategories
        }
      >
        {[
          "All prices",
          "Under $50",
          "$50 - $100",
          "$100+",
        ].map((value) => (
          <Pressable
            key={value}
            onPress={() =>
              onPriceFilterChange(value)
            }
            style={[
              styles.priceFilter,
              priceFilter === value &&
                styles.activePriceFilter,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                priceFilter === value &&
                  styles.activeText,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* PRICE SORT */}

      <Text style={styles.filterTitle}>
        Sort by price
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.priceCategories
        }
      >
        {[
          "Default",
          "Price: Low to High",
          "Price: High to Low",
        ].map((value) => (
          <Pressable
            key={value}
            onPress={() =>
              onPriceSortChange(value)
            }
            style={[
              styles.priceFilter,
              priceSort === value &&
                styles.activePriceFilter,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                priceSort === value &&
                  styles.activeText,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* PRODUCTS */}

      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) =>
          item.id
        }
        columnWrapperStyle={
          styles.columns
        }
        contentContainerStyle={
          styles.grid
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No items match your search yet.
          </Text>
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved={savedIds.includes(
              item.id,
            )}
            onSave={() =>
              onSave(item.id)
            }
            onOpen={() =>
              onOpen(item)
            }
          />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 110,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 28,
    paddingBottom: 24,
  },

  eyebrow: {
    color: "#65766D",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },

  heading: {
    color: "#173C34",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D6E5D7",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#225347",
    fontWeight: "800",
  },

  search: {
    height: 52,
    backgroundColor: "#FFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E6E9E2",
  },

  icon: {
    color: "#49635A",
    fontSize: 28,
    marginRight: 8,
  },

  input: {
    flex: 1,
    color: "#173C34",
    fontSize: 14,
  },

  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 32,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#173C34",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },

  muted: {
    color: "#87918C",
    fontSize: 12,
  },

  seeAll: {
    color: "#23775D",
    fontWeight: "700",
    fontSize: 12,
  },

  categories: {
    gap: 8,
    paddingBottom: 18,
  },

  category: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#ECEFE9",
  },

  activeCategory: {
    backgroundColor: "#1F5D4C",
  },

  categoryText: {
    color: "#64736C",
    fontSize: 12,
    fontWeight: "700",
  },

  activeText: {
    color: "#FFF",
  },

  filterTitle: {
    color: "#173C34",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 2,
  },

  priceCategories: {
    gap: 8,
    paddingBottom: 18,
  },

  priceFilter: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F4F1E9",
    borderWidth: 1,
    borderColor: "#E6E0D2",
  },

  activePriceFilter: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },

  grid: {
    gap: 14,
  },

  columns: {
    gap: 14,
  },

  empty: {
    textAlign: "center",
    color: "#87918C",
    padding: 30,
  },
});