import { StatusBar } from "expo-status-bar";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { EmptyState } from "./components/EmptyState";
import { ExplorePage } from "./pages/ExplorePage";
import { MessagesPage } from "./pages/MessagesPage";
import { MyListingsPage } from "./pages/MyListingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SavedPage } from "./pages/SavedPage";
import { seedListings } from "./data";
import { auth, db, firebaseConfigured } from "./firebase";
import { Listing, Tab } from "./types";

async function registerUser(user: User) {
  if (!db) return;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      displayName:
        user.displayName ||
        user.email?.split("@")[0] ||
        "Campus student",
      email: user.email || "",
      photoURL: user.photoURL || null,
      campus: "North Campus",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Explore");

  const [items, setItems] = useState(seedListings);

  const [queryText, setQueryText] = useState("");

  const [category, setCategory] =
    useState("All items");

  // PRICE FILTER
  const [priceFilter, setPriceFilter] =
    useState("All prices");

  // PRICE SORT
  const [priceSort, setPriceSort] =
    useState("Default");

  const [savedIds, setSavedIds] =
    useState<string[]>([]);

  const [selected, setSelected] =
    useState<Listing | null>(null);

  const [user, setUser] = useState<User | null>(
    auth?.currentUser || null,
  );

  const [authOpen, setAuthOpen] =
    useState(false);

  const [sellOpen, setSellOpen] =
    useState(false);

  const [authError, setAuthError] =
    useState("");

  const [profileReady, setProfileReady] =
    useState(false);

  useEffect(() => {
    const firebaseAuth = auth;

    if (!firebaseAuth) return;

    const handleUser = (nextUser: User | null) => {
      setUser(nextUser);

      if (nextUser) {
        registerUser(nextUser)
          .then(() => setProfileReady(true))
          .catch((error) =>
            setAuthError(
              error instanceof Error
                ? error.message
                : "Could not create profile.",
            ),
          );
      } else {
        setProfileReady(false);
      }
    };

    let unsubscribe: () => void = () => undefined;

    setPersistence(
      firebaseAuth,
      browserLocalPersistence,
    )
      .then(() => {
        unsubscribe =
          onAuthStateChanged(
            firebaseAuth,
            handleUser,
          );

        return getRedirectResult(
          firebaseAuth,
        );
      })
      .then((result) => {
        if (result?.user) {
          handleUser(result.user);
        }
      })
      .catch((error) =>
        setAuthError(
          error instanceof Error
            ? error.message
            : "Google sign-in could not be completed.",
        ),
      );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) return;

    const listingsQuery = query(
      collection(db, "listings"),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(
      listingsQuery,
      (snapshot) =>
        setItems(
          snapshot.empty
            ? seedListings
            : snapshot.docs.map(
                (entry) =>
                  ({
                    id: entry.id,
                    ...entry.data(),
                  }) as Listing,
              ),
        ),
      () => setItems(seedListings),
    );
  }, []);

  // SEARCH + CATEGORY + PRICE FILTER + PRICE SORT
  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesCategory =
        category === "All items" ||
        item.category === category;

      const matchesSearch = item.title
        .toLowerCase()
        .includes(
          queryText.toLowerCase(),
        );

      const matchesPrice =
        priceFilter === "All prices" ||
        (priceFilter === "Under $50" &&
          item.price < 50) ||
        (priceFilter === "$50 - $100" &&
          item.price >= 50 &&
          item.price <= 100) ||
        (priceFilter === "$100+" &&
          item.price > 100);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice
      );
    });

    // LOW TO HIGH
    if (priceSort === "Price: Low to High") {
      return [...filtered].sort(
        (a, b) => a.price - b.price,
      );
    }

    // HIGH TO LOW
    if (priceSort === "Price: High to Low") {
      return [...filtered].sort(
        (a, b) => b.price - a.price,
      );
    }

    return filtered;
  }, [
    category,
    items,
    priceFilter,
    priceSort,
    queryText,
  ]);

  const myListings = useMemo(
    () =>
      user
        ? items.filter(
            (item) =>
              item.sellerId === user.uid,
          )
        : [],
    [items, user],
  );

  const toggleSaved = (id: string) =>
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter(
            (value) => value !== id,
          )
        : [...current, id],
    );

  const signInWithGoogle = async () => {
    if (!auth) return;

    setAuthError("");

    try {
      await setPersistence(
        auth,
        browserLocalPersistence,
      );

      if (Platform.OS === "web") {
        const result =
          await signInWithPopup(
            auth,
            new GoogleAuthProvider(),
          );

        await registerUser(result.user);

        setUser(result.user);
        setProfileReady(true);
        setAuthOpen(false);
      } else {
        await signInAnonymously(auth);
        setAuthOpen(false);
      }
    } catch (error) {
      const code =
        error instanceof Error
          ? error.message
          : "Google sign-in failed.";

      if (
        Platform.OS === "web" &&
        /popup|cancelled-popup-request/i.test(
          code,
        )
      ) {
        await signInWithRedirect(
          auth,
          new GoogleAuthProvider(),
        );

        return;
      }

      setAuthError(code);

      Alert.alert(
        "Google sign-in failed",
        code,
      );
    }
  };

  const publish = async (
    title: string,
    price: string,
    listingCategory: string,
    description: string,
    condition: string,
  ): Promise<string | null> => {
    if (!user) {
      setSellOpen(false);
      setAuthOpen(true);
      return null;
    }

    try {
      await addDoc(collection(db!, "listings"), {
        title: title.trim(),
        price: Number(price),
        category: listingCategory,
        seller:
          user.displayName ||
          user.email ||
          "You",
        sellerId: user.uid,
        campus: "North Campus",
        condition: condition,
        image: seedListings[0].image,
        description: description.trim() || "New listing from a campus seller.",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Could not publish listing. Check your connection.";
      return msg;
    }

    setSellOpen(false);
    return null;
  };

  const contactSeller = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    setSelected(null);
    setTab("Messages");
  };

  const markAsSold = async (listing: Listing) => {
    if (db) {
      await updateDoc(doc(db, "listings", listing.id), {
        status: "sold",
      });
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === listing.id ? { ...i, status: "sold" } : i,
        ),
      );
    }

    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {tab === "Explore" && (
        <ExplorePage
          items={filteredItems}
          query={queryText}
          category={category}

          // PRICE FILTER
          priceFilter={priceFilter}

          // PRICE SORT
          priceSort={priceSort}

          savedIds={savedIds}
          onQueryChange={setQueryText}
          onCategoryChange={setCategory}

          // PRICE FILTER
          onPriceFilterChange={
            setPriceFilter
          }

          // PRICE SORT
          onPriceSortChange={setPriceSort}

          onSave={toggleSaved}
          onOpen={setSelected}
          onProfile={() =>
            setTab("Profile")
          }
        />
      )}

      {tab === "Saved" && (
        <SavedPage
          items={items.filter((item) =>
            savedIds.includes(item.id),
          )}
          onSave={toggleSaved}
          onOpen={setSelected}
        />
      )}

      {tab === "Messages" && (
        <MessagesPage
          onBrowse={() =>
            setTab("Explore")
          }
        />
      )}

      {tab === "MyListings" && (
        <MyListingsPage
          items={myListings}
          onOpen={setSelected}
          onSell={() =>
            setSellOpen(true)
          }
        />
      )}

      {tab === "Profile" && (
        <ProfilePage
          user={user}
          savedCount={savedIds.length}
          listingCount={myListings.length}
          firebaseConfigured={
            firebaseConfigured
          }
          profileReady={profileReady}
          error={authError}
          onMyListings={() =>
            user
              ? setTab("MyListings")
              : setAuthOpen(true)
          }
          onSaved={() => setTab("Saved")}
          onSignIn={() =>
            setAuthOpen(true)
          }
          onSignOut={() =>
            auth && signOut(auth)
          }
        />
      )}

      <BottomNav
        tab={tab}
        savedCount={savedIds.length}
        onChange={setTab}
        onSell={() =>
          setSellOpen(true)
        }
      />

      <ListingModal
        item={selected}
        user={user}
        onClose={() =>
          setSelected(null)
        }
        onContact={contactSeller}
        onMarkAsSold={markAsSold}
      />

      <AuthModal
        visible={authOpen}
        onClose={() =>
          setAuthOpen(false)
        }
        onSignIn={signInWithGoogle}
        error={authError}
      />

      <SellModal
        visible={sellOpen}
        onClose={() =>
          setSellOpen(false)
        }
        onSubmit={(title, price, category, description, condition) =>
          publish(title, price, category, description, condition)
        }
      />
    </SafeAreaView>
  );
}

function BottomNav({
  tab,
  savedCount,
  onChange,
  onSell,
}: {
  tab: Tab;
  savedCount: number;
  onChange: (tab: Tab) => void;
  onSell: () => void;
}) {
  return (
    <View style={styles.nav}>
      <NavItem
        label="Explore"
        icon="⌂"
        active={tab === "Explore"}
        onPress={() =>
          onChange("Explore")
        }
      />

      <NavItem
        label="Saved"
        icon="♡"
        active={tab === "Saved"}
        badge={savedCount}
        onPress={() =>
          onChange("Saved")
        }
      />

      <NavItem
        label="Messages"
        icon="□"
        active={tab === "Messages"}
        onPress={() =>
          onChange("Messages")
        }
      />

      <Pressable
        style={styles.sellButton}
        onPress={onSell}
      >
        <Text style={styles.sellPlus}>
          ＋
        </Text>

        <Text style={styles.sellText}>
          Sell
        </Text>
      </Pressable>
    </View>
  );
}

function NavItem({
  label,
  icon,
  active,
  badge,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  badge?: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >
      <View>
        <Text
          style={[
            styles.navIcon,
            active && styles.navActive,
          ]}
        >
          {icon}
        </Text>

        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        style={[
          styles.navLabel,
          active && styles.navActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ListingModal({
  item,
  user,
  onClose,
  onContact,
  onMarkAsSold,
}: {
  item: Listing | null;
  user: User | null;
  onClose: () => void;
  onContact: () => void;
  onMarkAsSold: (item: Listing) => void;
}) {
  return (
    <Modal
      visible={item !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {item && (
        <View style={styles.backdrop}>
          <View style={styles.detail}>
            <Image
              source={{
                uri: item.image,
              }}
              style={styles.detailImage}
            />

            <Pressable
              style={styles.close}
              onPress={onClose}
            >
              <Text
                style={styles.closeText}
              >
                ×
              </Text>
            </Pressable>

            <View
              style={styles.detailBody}
            >
              <Text
                style={styles.detailCategory}
              >
                {item.category.toUpperCase()}
              </Text>

              <Text
                style={styles.detailTitle}
              >
                {item.title}
              </Text>

              <Text
                style={styles.detailPrice}
              >
                ${item.price}
              </Text>

              <Text style={styles.muted}>
                {item.condition} ·{" "}
                {item.campus} ·{" "}
                {item.seller}
              </Text>

              <Text
                style={styles.description}
              >
                {item.description}
              </Text>

              <Pressable
                style={styles.primary}
                onPress={onContact}
              >
                <Text
                  style={styles.primaryText}
                >
                  {user
                    ? `Message ${item.seller}`
                    : "Sign in to contact seller"}
                </Text>
              </Pressable>

              {user && item.sellerId === user.uid && item.status !== "sold" ? (
                <Pressable
                  style={styles.outline}
                  onPress={() => onMarkAsSold(item)}
                >
                  <Text style={styles.outlineText}>
                    Mark as sold
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}

function AuthModal({
  visible,
  onClose,
  onSignIn,
  error,
}: {
  visible: boolean;
  onClose: () => void;
  onSignIn: () => Promise<void>;
  error: string;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.backdrop}>
        <View style={styles.auth}>
          <Text style={styles.formTitle}>
            Welcome to campus marketplace
          </Text>

          <Text
            style={styles.authMessage}
          >
            Sign in to save listings, message
            sellers, and publish your own
            items.
          </Text>

          {error ? (
            <Text
              style={styles.authError}
            >
              {error}
            </Text>
          ) : null}

          <Pressable
            style={styles.googleButton}
            onPress={onSignIn}
          >
            <Text
              style={styles.googleMark}
            >
              G
            </Text>

            <Text
              style={styles.outlineText}
            >
              Continue with Google
            </Text>
          </Pressable>

          <Pressable
            style={styles.outline}
            onPress={onClose}
          >
            <Text
              style={styles.outlineText}
            >
              Maybe later
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const sellCategories = ["Textbooks", "Furniture", "Tech", "Fashion"];
const sellConditions = ["New", "Like New", "Good", "Fair", "Poor"];
const TITLE_MAX = 50;
const DESC_MAX = 200;

function SellModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    price: string,
    category: string,
    description: string,
    condition: string,
  ) => Promise<string | null>;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [condition, setCondition] = useState("Good");
  const [sellError, setSellError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset form every time modal opens fresh
  useEffect(() => {
    if (visible) {
      setTitle("");
      setPrice("");
      setDescription("");
      setCategory("Textbooks");
      setCondition("Good");
      setSellError("");
      setLoading(false);
      setSuccess(false);
    }
  }, [visible]);

  const validate = (): string => {
    if (title.trim().length < 3) {
      return "Title must be at least 3 characters.";
    }
    const priceNum = Number(price);
    if (!price.trim() || isNaN(priceNum) || priceNum <= 0) {
      return "Price must be a number greater than 0.";
    }
    return "";
  };

  const handlePublish = async () => {
    const validationError = validate();
    if (validationError) {
      setSellError(validationError);
      return;
    }
    setSellError("");
    setLoading(true);
    const serverError = await onSubmit(
      title.trim(), price, category, description, condition,
    );
    setLoading(false);
    if (serverError) {
      setSellError(serverError);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    }
  };

  const handleClose = () => {
    setSellError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.backdrop}>
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              Sell an item
            </Text>
            <Pressable onPress={handleClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          {/* ✅ SUCCESS */}
          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                🎉 Listing published successfully!
              </Text>
            </View>
          ) : null}

          {/* ❌ ERROR */}
          {sellError ? (
            <Text style={styles.authError}>
              {sellError}
            </Text>
          ) : null}

          {/* TITLE */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>What are you selling? <Text style={styles.required}>*</Text></Text>
            <Text style={styles.charCount}>{title.length}/{TITLE_MAX}</Text>
          </View>
          <TextInput
            value={title}
            onChangeText={(text) => {
              if (text.length <= TITLE_MAX) { setTitle(text); setSellError(""); }
            }}
            placeholder="e.g. Organic Chemistry textbook"
            style={styles.field}
            editable={!loading}
            maxLength={TITLE_MAX}
          />

          {/* PRICE */}
          <Text style={styles.label}>Price ($) <Text style={styles.required}>*</Text></Text>
          <TextInput
            value={price}
            onChangeText={(text) => { setPrice(text); setSellError(""); }}
            keyboardType="numeric"
            placeholder="e.g. 25"
            style={styles.field}
            editable={!loading}
          />

          {/* CATEGORY */}
          <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
          <View style={styles.categoryRow}>
            {sellCategories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
              >
                <Text style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextActive,
                ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* CONDITION */}
          <Text style={styles.label}>Condition <Text style={styles.required}>*</Text></Text>
          <View style={styles.categoryRow}>
            {sellConditions.map((cond) => (
              <Pressable
                key={cond}
                onPress={() => setCondition(cond)}
                style={[
                  styles.categoryChip,
                  condition === cond && styles.categoryChipActive,
                ]}
              >
                <Text style={[
                  styles.categoryChipText,
                  condition === cond && styles.categoryChipTextActive,
                ]}>
                  {cond}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* DESCRIPTION */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.charCount}>{description.length}/{DESC_MAX}</Text>
          </View>
          <TextInput
            value={description}
            onChangeText={(text) => {
              if (text.length <= DESC_MAX) setDescription(text);
            }}
            placeholder="Describe your item — condition details, what’s included, why you’re selling..."
            style={[styles.field, styles.descriptionField]}
            multiline
            numberOfLines={3}
            editable={!loading}
            maxLength={DESC_MAX}
          />

          <Pressable
            style={[styles.primary, loading && styles.disabled]}
            onPress={handlePublish}
            disabled={loading}
          >
            <Text style={styles.primaryText}>
              {loading ? "Publishing..." : "Publish listing"}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F4",
  },

  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 82,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EBE5",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
    minWidth: 54,
  },

  navIcon: {
    color: "#83918A",
    fontSize: 22,
  },

  navLabel: {
    color: "#83918A",
    fontSize: 10,
    marginTop: 3,
  },

  navActive: {
    color: "#1D6B54",
  },

  badge: {
    position: "absolute",
    right: -12,
    top: -3,
    backgroundColor: "#C3535B",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
  },

  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },

  sellButton: {
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E6F0E6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 4,
  },

  sellPlus: {
    color: "#247055",
    fontSize: 20,
  },

  sellText: {
    color: "#247055",
    fontWeight: "800",
    fontSize: 12,
  },

  backdrop: {
    flex: 1,
    backgroundColor:
      "rgba(15,40,33,.45)",
    justifyContent: "flex-end",
  },

  detail: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },

  detailImage: {
    width: "100%",
    height: 230,
  },

  close: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    color: "#173C34",
    fontSize: 26,
  },

  detailBody: {
    padding: 24,
  },

  detailCategory: {
    color: "#23775D",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  detailTitle: {
    color: "#173C34",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 8,
  },

  detailPrice: {
    color: "#1C7057",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },

  muted: {
    color: "#87918C",
    fontSize: 12,
  },

  description: {
    color: "#66736D",
    fontSize: 14,
    lineHeight: 21,
    marginVertical: 20,
  },

  primary: {
    height: 50,
    backgroundColor: "#1F5D4C",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  primaryText: {
    color: "#FFF",
    fontWeight: "800",
  },

  auth: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    margin: 20,
  },

  form: {
    padding: 24,
    paddingBottom: 40,
  },

  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  formTitle: {
    color: "#173C34",
    fontSize: 22,
    fontWeight: "800",
  },

  authMessage: {
    color: "#87918C",
    lineHeight: 20,
    marginTop: 10,
  },

  authError: {
    color: "#B64950",
    backgroundColor: "#FBECEE",
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    marginTop: 16,
  },

  googleButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7DDD8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 10,
  },

  googleMark: {
    color: "#4285F4",
    fontSize: 18,
    fontWeight: "800",
  },

  outline: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BCD0C3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  outlineText: {
    color: "#1F5D4C",
    fontWeight: "800",
  },

  label: {
    color: "#365B4C",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 7,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 7,
  },

  required: {
    color: "#C3535B",
  },

  charCount: {
    color: "#83918A",
    fontSize: 11,
  },

  formScroll: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },

  field: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDE4DC",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#173C34",
  },

  disabled: {
    opacity: 0.45,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },

  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BCD0C3",
    backgroundColor: "#F4F9F6",
  },

  categoryChipActive: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },

  categoryChipText: {
    color: "#365B4C",
    fontSize: 13,
    fontWeight: "600",
  },

  categoryChipTextActive: {
    color: "#FFF",
  },

  successBox: {
    backgroundColor: "#E6F4ED",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    alignItems: "center",
  },

  successText: {
    color: "#1F5D4C",
    fontWeight: "700",
    fontSize: 14,
  },

  descriptionField: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },
});