"use client";

import { theme } from "@/lib/theme";

export type ItemRow = {
  sort_order: number;
  description: string;
  quantity: number;
  unit: string;
  notes: string;
  image_url: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: `1px solid ${theme.grayInputBorder}`,
  borderRadius: 6,
  fontSize: "0.9375rem",
  background: theme.white,
  color: "#111827",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.625rem 0.75rem",
  borderBottom: `2px solid ${theme.grayInputBorder}`,
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#374151",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  borderBottom: `1px solid ${theme.grayBorder}`,
  verticalAlign: "middle",
};

export function ItemsTable({
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  items: ItemRow[];
  onChange: (items: ItemRow[]) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: 40 }}>#</th>
            <th style={thStyle}>Description</th>
            <th style={{ ...thStyle, width: 90 }}>Qty</th>
            <th style={{ ...thStyle, width: 100 }}>Unit</th>
            <th style={thStyle}>Notes</th>
            <th style={{ ...thStyle, width: 160 }}>Image</th>
            <th style={{ ...thStyle, width: 90 }} />
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? theme.white : theme.grayBg }}>
              <td style={{ ...tdStyle, fontSize: "0.875rem", color: theme.grayMuted }}>
                {i + 1}
              </td>
              <td style={tdStyle}>
                <input
                  value={item.description}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) =>
                        j === i ? { ...x, description: e.target.value } : x
                      )
                    )
                  }
                  placeholder="Item description"
                  style={{ ...inputStyle, minWidth: 140 }}
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) =>
                        j === i
                          ? { ...x, quantity: Number(e.target.value) || 0 }
                          : x
                      )
                    )
                  }
                  style={{ ...inputStyle, width: 70 }}
                />
              </td>
              <td style={tdStyle}>
                <input
                  value={item.unit}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) =>
                        j === i ? { ...x, unit: e.target.value } : x
                      )
                    )
                  }
                  placeholder="e.g. unit, set"
                  style={{ ...inputStyle, minWidth: 80 }}
                />
              </td>
              <td style={tdStyle}>
                <input
                  value={item.notes}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) =>
                        j === i ? { ...x, notes: e.target.value } : x
                      )
                    )
                  }
                  placeholder="Optional notes"
                  style={{ ...inputStyle, minWidth: 120 }}
                />
              </td>
              <td style={tdStyle}>
                <ItemImageCell
                  imageUrl={item.image_url}
                  onChange={(url) =>
                    onChange(
                      items.map((x, j) =>
                        j === i ? { ...x, image_url: url } : x
                      )
                    )
                  }
                />
              </td>
              <td style={tdStyle}>
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.875rem",
                    color: theme.grayMuted,
                    background: theme.white,
                    border: `1px solid ${theme.grayInputBorder}`,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={onAdd}
        style={{
          marginTop: "0.75rem",
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          color: theme.grayMuted,
          background: theme.white,
          border: `1px solid ${theme.grayInputBorder}`,
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Add row
      </button>
    </div>
  );
}

function ItemImageCell({
  imageUrl,
  onChange,
}: {
  imageUrl: string;
  onChange: (url: string) => void;
}) {
  const validUrl =
    imageUrl.trim().length > 0 &&
    (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        minWidth: 0,
      }}
    >
      {validUrl && (
        <img
          src={imageUrl}
          alt=""
          style={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: 6,
            border: `1px solid ${theme.grayInputBorder}`,
          }}
          onError={() => {}}
        />
      )}
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL (optional)"
        style={{ ...inputStyle, minWidth: 0 }}
      />
    </div>
  );
}
