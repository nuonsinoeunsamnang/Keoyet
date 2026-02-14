"use client";

export type ItemRow = {
  sort_order: number;
  description: string;
  quantity: number;
  unit: string;
  notes: string;
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
            <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>#</th>
            <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Description</th>
            <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Qty</th>
            <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Unit</th>
            <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Notes</th>
            <th style={{ width: 80 }} />
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>{i + 1}</td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
                <input
                  value={item.description}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) =>
                        j === i ? { ...x, description: e.target.value } : x
                      )
                    )
                  }
                  style={{ width: "100%", padding: "0.25rem" }}
                />
              </td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
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
                  style={{ width: 60, padding: "0.25rem" }}
                />
              </td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
                <input
                  value={item.unit}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) =>
                        j === i ? { ...x, unit: e.target.value } : x
                      )
                    )
                  }
                  style={{ width: 80, padding: "0.25rem" }}
                />
              </td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
                <input
                  value={item.notes}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) =>
                        j === i ? { ...x, notes: e.target.value } : x
                      )
                    )
                  }
                  style={{ width: "100%", padding: "0.25rem" }}
                />
              </td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  style={{ padding: "0.25rem 0.5rem" }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={onAdd} style={{ marginTop: "0.5rem" }}>
        Add row
      </button>
    </div>
  );
}
