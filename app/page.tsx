"use client";
import { useState } from "react";

const initialItems = [
  {
    id: 1,
    brand: "Louis Vuitton",
    item: "Monogram Pochette Métis",
    status: "authenticated",
    notes: "Date code verified, stitching consistent, hardware correct weight.",
    image: "/LV monogram pochette metis.jpg",
  },
  {
    id: 2,
    brand: "Dior",
    item: "Lady Dior Bag",
    status: "pending",
    notes: "Awaiting hardware inspection and serial number verification.",
    image: "/lady dior bag.jpg",
  },
  {
    id: 3,
    brand: "Prada",
    item: "Saffiano Tote",
    status: "rejected",
    notes: "Stitching inconsistent, date stamp placement incorrect.",
    image: "/prada bag.jpg",
  },
  {
    id: 4,
    brand: "Gucci",
    item: "Marmont Shoulder Bag",
    status: "authenticated",
    notes:
      "Hardware weight correct, serial number verified, leather authentic.",
    image: "/gucci marmont bag.jpg",
  },
];

const statusStyles = {
  authenticated: "bg-[#e8f0e8] text-[#4a7c4a]",
  pending: "bg-[#f5f0e8] text-[#8a6a2a]",
  rejected: "bg-[#f0e8e8] text-[#7c4a4a]",
};

export default function Home() {
  const [items, setItems] = useState(initialItems);
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

  const filtered = items.filter((i) => {
    const matchesSearch =
      i.brand.toLowerCase().includes(search.toLowerCase()) ||
      i.item.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    if (!newItem.brand || !newItem.item) return;
    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({
      brand: "",
      item: "",
      status: "pending",
      notes: "",
      image: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => setItems(items.filter((i) => i.id !== id));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewItem({ ...newItem, image: reader.result });
    reader.readAsDataURL(file);
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
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border border-[#e8e0d8] px-4 py-3 text-sm font-light focus:outline-none"
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
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs tracking-widest uppercase text-gray-300 hover:text-black transition-colors border-b border-gray-200 hover:border-black pb-0.5"
                >
                  Remove
                </button>
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
