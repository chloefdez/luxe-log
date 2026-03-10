"use client";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const statusStyles = {
  authenticated: "bg-[#e8f0e8] text-[#4a7c4a]",
  pending: "bg-[#f5f0e8] text-[#8a6a2a]",
  rejected: "bg-[#f0e8e8] text-[#7c4a4a]",
};

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    brand: "",
    item: "",
    status: "pending",
    notes: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ status: "", notes: "" });
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    });
    return () => unsubscribe();
  }, []);

  const filtered = items
    .filter((i) => {
      const matchesSearch =
        i.brand.toLowerCase().includes(search.toLowerCase()) ||
        i.item.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "brand") return a.brand.localeCompare(b.brand);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  const handleAdd = async () => {
    if (!newItem.brand || !newItem.item) return;
    await addDoc(collection(db, "items"), newItem);
    setNewItem({ brand: "", item: "", status: "pending", notes: "", image: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "items", id));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ status: item.status, notes: item.notes });
  };

  const handleSaveEdit = async (id: string) => {
    await updateDoc(doc(db, "items", id), {
      status: editForm.status,
      notes: editForm.notes,
    });
    setEditingId(null);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <nav className="flex justify-between items-center px-12 py-8 border-b border-[#e8e0d8]">
        <div>
          <h1 className="text-black font-light tracking-[0.3em] text-sm uppercase">
            LuxeLog
          </h1>
          <p className="text-xs text-[#c9a99a] tracking-widest uppercase mt-1">
            Authentication Tracker
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-[#c9a99a] transition-colors font-light"
        >
          + New Item
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Items", value: items.length, color: "text-black" },
            {
              label: "Authenticated",
              value: items.filter((i) => i.status === "authenticated").length,
              color: "text-[#4a7c4a]",
            },
            {
              label: "Pending",
              value: items.filter((i) => i.status === "pending").length,
              color: "text-[#8a6a2a]",
            },
            {
              label: "Rejected",
              value: items.filter((i) => i.status === "rejected").length,
              color: "text-[#7c4a4a]",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-[#e8e0d8] p-6"
            >
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                {stat.label}
              </p>
              <p className={`text-3xl font-light ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <input
            type="text"
            placeholder="Search by brand or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-[#e8e0d8] px-6 py-3 text-sm font-light tracking-wide focus:outline-none focus:border-black transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#e8e0d8] px-6 py-3 text-sm font-light tracking-wide focus:outline-none focus:border-black transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="authenticated">Authenticated</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#e8e0d8] px-6 py-3 text-sm font-light tracking-wide focus:outline-none focus:border-black transition-colors"
          >
            <option value="default">Sort By</option>
            <option value="brand">Brand</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Add Item Form */}
        {showForm && (
          <div className="bg-white border border-[#e8e0d8] p-10 mb-12">
            <p className="text-xs tracking-[0.4em] text-[#c9a99a] uppercase mb-8">
              New Item
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                placeholder="Brand"
                value={newItem.brand}
                onChange={(e) =>
                  setNewItem({ ...newItem, brand: e.target.value })
                }
                className="border border-[#e8e0d8] px-4 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors"
              />
              <input
                placeholder="Item name"
                value={newItem.item}
                onChange={(e) =>
                  setNewItem({ ...newItem, item: e.target.value })
                }
                className="border border-[#e8e0d8] px-4 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors"
              />
              <select
                value={newItem.status}
                onChange={(e) =>
                  setNewItem({ ...newItem, status: e.target.value })
                }
                className="border border-[#e8e0d8] px-4 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="authenticated">Authenticated</option>
                <option value="rejected">Rejected</option>
              </select>
              <input
                placeholder="Image URL (optional)"
                value={newItem.image}
                onChange={(e) =>
                  setNewItem({ ...newItem, image: e.target.value })
                }
                className="border border-[#e8e0d8] px-4 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors"
              />
              <textarea
                placeholder="Notes..."
                value={newItem.notes}
                onChange={(e) =>
                  setNewItem({ ...newItem, notes: e.target.value })
                }
                className="border border-[#e8e0d8] px-4 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors md:col-span-2 h-24 resize-none"
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAdd}
                className="px-8 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-[#c9a99a] transition-colors font-light"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-8 py-3 border border-black text-black text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors font-light"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#e8e0d8] hover:border-black transition-colors"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.item}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">
                      {item.brand}
                    </p>
                    <h3
                      className="text-black font-light text-lg"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {item.item}
                    </h3>
                  </div>
                  <span
                    className={`text-xs tracking-widest uppercase px-3 py-1 ${
                      statusStyles[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                {item.notes && (
                  <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
                    {item.notes}
                  </p>
                )}
                {editingId === item.id ? (
                  <div className="mt-4">
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                      className="border border-[#e8e0d8] px-3 py-2 text-xs font-light w-full mb-3 focus:outline-none focus:border-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="authenticated">Authenticated</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, notes: e.target.value })
                      }
                      className="border border-[#e8e0d8] px-3 py-2 text-xs font-light w-full mb-3 focus:outline-none focus:border-black resize-none h-20"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="text-xs tracking-widest uppercase text-white bg-black px-4 py-2 hover:bg-[#c9a99a] transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs tracking-widest uppercase text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-6 mt-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors border-b border-gray-200 hover:border-black pb-0.5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs tracking-widest uppercase text-gray-300 hover:text-black transition-colors border-b border-gray-200 hover:border-black pb-0.5"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-300 tracking-widest uppercase text-sm">
              No items found
            </p>
          </div>
        )}
      </div>

      <footer className="text-center py-8 text-xs tracking-widest text-gray-300 uppercase border-t border-[#e8e0d8]">
        © 2026 LuxeLog
      </footer>
    </main>
  );
}
