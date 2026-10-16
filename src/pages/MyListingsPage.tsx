import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { PageTitle } from "../components/PageTitle";
import { Listing } from "../types";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { EditListingModal } from "../components/EditListingModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { MyListingCard } from "../components/MyListingCard";

export function MyListingsPage({
  items,
  onOpen,
  onSell,
}: {
  items: Listing[];
  onOpen: (item: Listing) => void;
  onSell: () => void;
}) {
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);

  const activeCount = items.filter(i => i.status !== 'sold').length;
  const soldCount = items.filter(i => i.status === 'sold').length;
  const totalCount = items.length;

  const handleEditSubmit = async (id: string, title: string, price: string) => {
    if (db) {
      await updateDoc(doc(db, "listings", id), {
        title: title.trim(),
        price: Number(price),
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingListing && db) {
      await deleteDoc(doc(db, "listings", deletingListing.id));
    }
    setDeletingListing(null);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <PageTitle
          title="My listings"
          subtitle="Items you have posted to campus marketplace"
        />

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{soldCount}</Text>
            <Text style={styles.statLabel}>Sold</Text>
          </View>
        </View>

        <FlatList
          data={items}
          scrollEnabled={false}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.columns}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={
            <EmptyState
              title="No listings yet"
              message="Publish an item and it will appear here."
              action="Sell an item"
              onAction={onSell}
            />
          }
          renderItem={({ item }) => (
            <MyListingCard
              item={item}
              onOpen={() => onOpen(item)}
              onEdit={() => setEditingListing(item)}
              onDelete={() => setDeletingListing(item)}
            />
          )}
        />
      </ScrollView>

      <EditListingModal
        visible={editingListing !== null}
        listing={editingListing}
        onClose={() => setEditingListing(null)}
        onSubmit={handleEditSubmit}
      />

      <ConfirmModal
        visible={deletingListing !== null}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        onCancel={() => setDeletingListing(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  columns: { gap: 14 },
  grid: { gap: 14 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECE6',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F5D4C',
  },
  statLabel: {
    fontSize: 12,
    color: '#83918A',
    marginTop: 4,
  },
});
