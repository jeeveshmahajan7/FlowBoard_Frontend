export const reactSelectStyles = (theme = "dark") => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#hsl(var(--b1))" : "#ffffff",
    borderColor: state.isFocused
      ? "#d1d5db" // primary
      : theme === "dark"
      ? "#374151"
      : "#d1d5db",
    boxShadow: "none",
    minHeight: "44px",
    ":hover": {
      borderColor: "#d1d5db",
    },
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#1f2933" : "#ffffff",
    zIndex: 50,
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? theme === "dark"
        ? "#374151"
        : "#e5e7eb"
      : "transparent",
    color: theme === "dark" ? "#e5e7eb" : "#111827",
    cursor: "pointer",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "#6366f1",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "#ffffff",
    fontSize: "0.75rem",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "#ffffff",
    ":hover": {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
    },
  }),

  placeholder: (base) => ({
    ...base,
    color: theme === "dark" ? "#9ca3af" : "#6b7280",
    fontSize: "0.875rem",
  }),

  input: (base) => ({
    ...base,
    color: theme === "dark" ? "#e5e7eb" : "#111827",
  }),
});
