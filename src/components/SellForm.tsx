import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { categories as allCategories } from "../data";

export type SellFormValues = {
  title: string;
  price: string;
  category: string;
  condition: string;
  campus: string;
  description: string;
  imageUrl: string;
};

type FieldErrors = Partial<Record<keyof SellFormValues, string>>;

const LISTING_CATEGORIES = allCategories.filter((c) => c !== "All items");
const CONDITIONS = ["Like new", "Good condition", "Fair", "Needs repair"];
const CAMPUSES = ["North Campus", "West Village", "East Quad", "South Hall"];

const EMPTY: SellFormValues = {
  title: "",
  price: "",
  category: "",
  condition: "",
  campus: "",
  description: "",
  imageUrl: "",
};

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateSellForm(values: SellFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const title = values.title.trim();
  const priceRaw = values.price.trim().replace(/^\$/, "");
  const description = values.description.trim();
  const imageUrl = values.imageUrl.trim();

  if (!title) errors.title = "Title is required.";
  else if (title.length < 3)
    errors.title = "Title must be at least 3 characters.";

  if (!priceRaw) errors.price = "Price is required.";
  else if (!/^\d+(\.\d{1,2})?$/.test(priceRaw))
    errors.price = "Enter a valid price (e.g. 25 or 25.99).";
  else if (Number(priceRaw) <= 0)
    errors.price = "Price must be greater than 0.";

  if (!values.category) errors.category = "Select a category.";
  if (!values.condition) errors.condition = "Select a condition.";
  if (!values.campus) errors.campus = "Select a campus.";

  if (!description) errors.description = "Description is required.";
  else if (description.length < 10)
    errors.description = "Description must be at least 10 characters.";

  if (imageUrl && !isValidHttpUrl(imageUrl))
    errors.imageUrl = "Enter a valid http(s) image URL, or leave blank.";

  return errors;
}

export function SellModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: SellFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<SellFormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touchedSubmit, setTouchedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!visible) return;
    setValues(EMPTY);
    setErrors({});
    setTouchedSubmit(false);
    setSubmitting(false);
    setSubmitError("");
  }, [visible]);

  const setField = <K extends keyof SellFormValues>(
    key: K,
    value: SellFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (touchedSubmit) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const handlePublish = async () => {
    setTouchedSubmit(true);
    setSubmitError("");
    const nextErrors = validateSellForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
      setValues(EMPTY);
      setErrors({});
      setTouchedSubmit(false);
      setSubmitError("");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not publish listing. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.form}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Sell an item</Text>
            <Pressable onPress={onClose} accessibilityLabel="Close sell form">
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            <FieldLabel>What are you selling?</FieldLabel>
            <TextInput
              value={values.title}
              onChangeText={(text) => setField("title", text)}
              placeholder="e.g. Organic Chemistry textbook"
              placeholderTextColor="#87918C"
              style={[styles.field, errors.title && styles.fieldError]}
            />
            {errors.title ? (
              <Text style={styles.errorText}>{errors.title}</Text>
            ) : null}

            <FieldLabel>Price (USD)</FieldLabel>
            <TextInput
              value={values.price}
              onChangeText={(text) => setField("price", text)}
              keyboardType="decimal-pad"
              placeholder="e.g. 25.00"
              placeholderTextColor="#87918C"
              style={[styles.field, errors.price && styles.fieldError]}
            />
            {errors.price ? (
              <Text style={styles.errorText}>{errors.price}</Text>
            ) : null}

            <FieldLabel>Category</FieldLabel>
            <ChipRow
              options={LISTING_CATEGORIES}
              selected={values.category}
              onSelect={(value) => setField("category", value)}
            />
            {errors.category ? (
              <Text style={styles.errorText}>{errors.category}</Text>
            ) : null}

            <FieldLabel>Condition</FieldLabel>
            <ChipRow
              options={CONDITIONS}
              selected={values.condition}
              onSelect={(value) => setField("condition", value)}
            />
            {errors.condition ? (
              <Text style={styles.errorText}>{errors.condition}</Text>
            ) : null}

            <FieldLabel>Campus</FieldLabel>
            <ChipRow
              options={CAMPUSES}
              selected={values.campus}
              onSelect={(value) => setField("campus", value)}
            />
            {errors.campus ? (
              <Text style={styles.errorText}>{errors.campus}</Text>
            ) : null}

            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={values.description}
              onChangeText={(text) => setField("description", text)}
              placeholder="Include condition details, pickup notes, etc."
              placeholderTextColor="#87918C"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={[
                styles.field,
                styles.multiline,
                errors.description && styles.fieldError,
              ]}
            />
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : (
              <Text style={styles.helper}>At least 10 characters.</Text>
            )}

            <FieldLabel>Image URL (optional)</FieldLabel>
            <TextInput
              value={values.imageUrl}
              onChangeText={(text) => setField("imageUrl", text)}
              placeholder="https://example.com/photo.jpg"
              placeholderTextColor="#87918C"
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.field, errors.imageUrl && styles.fieldError]}
            />
            {errors.imageUrl ? (
              <Text style={styles.errorText}>{errors.imageUrl}</Text>
            ) : (
              <Text style={styles.helper}>
                Paste a direct http(s) link. Leave blank to use a placeholder
                image.
              </Text>
            )}

            {submitError ? (
              <Text style={styles.submitError}>{submitError}</Text>
            ) : null}

            <Pressable
              disabled={submitting}
              style={[styles.primary, submitting && styles.disabled]}
              onPress={handlePublish}
            >
              <Text style={styles.primaryText}>
                {submitting ? "Publishing…" : "Publish listing"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

function ChipRow({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = selected === option;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,40,33,.45)",
    justifyContent: "flex-end",
  },
  form: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    maxHeight: "92%",
  },
  scrollBody: { paddingBottom: 32 },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  formTitle: { color: "#173C34", fontSize: 22, fontWeight: "800" },
  closeText: { color: "#173C34", fontSize: 26 },
  label: {
    color: "#365B4C",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 7,
  },
  field: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#DDE4DC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#173C34",
    backgroundColor: "#FFF",
  },
  fieldError: { borderColor: "#C3535B" },
  multiline: { minHeight: 96 },
  errorText: { color: "#B64950", fontSize: 12, marginTop: 6 },
  helper: { color: "#87918C", fontSize: 12, marginTop: 6 },
  submitError: {
    color: "#B64950",
    backgroundColor: "#FBECEE",
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    marginTop: 16,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#D7DDD8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F7FAF7",
  },
  chipActive: { backgroundColor: "#1F5D4C", borderColor: "#1F5D4C" },
  chipText: { color: "#365B4C", fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: "#FFF" },
  primary: {
    height: 50,
    backgroundColor: "#1F5D4C",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  primaryText: { color: "#FFF", fontWeight: "800" },
  disabled: { opacity: 0.45 },
});
