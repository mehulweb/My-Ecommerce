import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const AddressPage = () => {
  const navigate = useNavigate();
  const param = useParams();

  // =====================================================
  // COUNTRIES
  // =====================================================

  const countries = ["India"];

  // =====================================================
  // INDIA STATES + UNION TERRITORIES
  // =====================================================

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // =====================================================
  // DEFAULT FORM
  // =====================================================

  const defaultForm = {
    name: "",
    phone: "",
    country: "India",
    address: "",
    state: "",
    pincode: "",
    type: "Home",
  };

  // =====================================================
  // STATES
  // =====================================================

  const [addresses, setAddresses] = useState([]);
  const [product, setProduct] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] =
    useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [locationLoading, setLocationLoading] =
    useState(false);
  const [locationError, setLocationError] = useState("");
  const [savingAddress, setSavingAddress] =
    useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // GET PRODUCT
  // =====================================================

  useEffect(() => {
    api
      .get(`/product/${param.id}`)
      .then((res) => {
        console.log(
          "fetch api",
          res.data.product
        );

        setProduct(res.data.product);
      })
      .catch((err) => {
        console.error(
          "Error fetching product:",
          err
        );
      });
  }, [param.id]);

  // =====================================================
  // GET USER ADDRESSES
  // =====================================================

  useEffect(() => {
    api
      .get("/user/address")
      .then((res) => {
        console.log(
          "getuser-address",
          res.data
        );

        setAddresses(res.data.data || []);
      })
      .catch((err) => {
        console.error(
          "Error fetching addresses:",
          err
        );
      });
  }, []);

  // =====================================================
  // CURRENT LOCATION
  // =====================================================

  const getCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Your browser does not support location."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              "Address fetch failed"
            );
          }

          const data = await response.json();
          const location =
            data.address || {};

          const detectedCountry =
            location.country || "India";

          setFormData((prev) => ({
            ...prev,

            address:
              [
                location.house_number,
                location.road,
                location.neighbourhood,
                location.suburb,
              ]
                .filter(Boolean)
                .join(", ") ||
              prev.address,

            city:
              location.city ||
              location.town ||
              location.village ||
              location.municipality ||
              "",

            state: location.state || "",

            country: detectedCountry,

            pincode:
              location.postcode || "",
          }));

          setEditingId(null);
          setShowAddressModal(true);
        } catch (error) {
          console.error(error);

          setLocationError(
            "Location mil gayi, lekin address fetch nahi ho paaya."
          );

          setEditingId(null);
          setShowAddressModal(true);
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        setLocationLoading(false);

        if (error.code === 1) {
          setLocationError(
            "Please allow location permission."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Location available nahi hai."
          );
        } else {
          setLocationError(
            "Location fetch nahi ho paayi."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =====================================================
  // ADD ADDRESS
  // =====================================================

  const openAddAddress = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setLocationError("");
    setShowAddressModal(true);
  };

  // =====================================================
  // EDIT ADDRESS
  // =====================================================

  const openEditAddress = (address) => {
    setFormData({
      name: address.name || "",
      phone: address.phone || "",
      country: address.country || "India",
      address: address.address || "",
      state: address.state || "",
      pincode: address.pincode || "",
      type: address.type || "Home",
    });

    setEditingId(address._id);
    setLocationError("");
    setShowAddressModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingId(null);
    setFormData(defaultForm);
    setLocationError("");
  };

  // =====================================================
  // SAVE / UPDATE ADDRESS
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingAddress(true);

      const { data } = await api.post(
        "/add-address",
        formData
      );

      console.log(
        "address saved:",
        data
      );

      /*
       * Backend response agar saved address deta hai
       * to usko use karenge.
       *
       * Agar backend response structure different hai,
       * existing local object fallback ke roop me use hoga.
       */

      const savedAddress =
        data?.data ||
        data?.address ||
        null;

      if (editingId) {
        setAddresses((prev) =>
          prev.map((address) =>
            address._id === editingId
              ? {
                  ...address,
                  ...formData,
                  ...(savedAddress || {}),
                  _id:
                    savedAddress?._id ||
                    editingId,
                }
              : address
          )
        );

        setSelectedAddress(
          savedAddress?._id ||
            editingId
        );
      } else {
        const newAddress = {
          ...formData,
          ...(savedAddress || {}),
          _id:
            savedAddress?._id ||
            `temp-${Date.now()}`,
        };

        setAddresses((prev) => [
          ...prev,
          newAddress,
        ]);

        setSelectedAddress(
          newAddress._id
        );
      }

      closeAddressModal();
    } catch (error) {
      console.error(
        "Save address error:",
        error
      );

      setLocationError(
        error.response?.data?.message ||
          "Address save nahi ho paaya."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // =====================================================
  // DELETE ADDRESS
  // =====================================================

  const deleteAddress = (id) => {
    setAddresses((prev) =>
      prev.filter(
        (address) =>
          address._id !== id
      )
    );

    if (selectedAddress === id) {
      setSelectedAddress(null);
    }
  };

  // =====================================================
  // GET SELECTED ADDRESS OBJECT
  // =====================================================

  const getSelectedAddress = () => {
    return addresses.find(
      (address) =>
        address._id === selectedAddress
    );
  };

  // =====================================================
  // CONTINUE TO PAYMENT
  // =====================================================

  const continueToPayment = () => {
    if (!selectedAddress) {
      alert(
        "Please select a delivery address."
      );
      return;
    }

    const address =
      getSelectedAddress();

    if (!address) {
      alert(
        "Selected address not found."
      );
      return;
    }

    /*
     * IMPORTANT:
     *
     * Pehle sirf addressId bhej rahe the.
     *
     * Ab complete shipping address
     * Payment page ko bhej rahe hain.
     */

    const shippingAddress = {
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city || "",
      state: address.state,
      pincode: address.pincode,
    };

    navigate(
      `/payment/${param.id}`,
      {
        state: {
          item: { product, quantity: 1 },
          addressId: address._id,
          shippingAddress,
        },
      }
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">

      {/* ================================================= */}
      {/* SMALL NAVBAR */}
      {/* ================================================= */}

      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="text-lg font-bold tracking-tight text-indigo-600 sm:text-xl">
            MyStore
          </div>

          <div className="text-xs font-medium text-slate-500 sm:text-sm">
            Secure Checkout 🔒
          </div>

        </div>
      </nav>

      {/* ================================================= */}
      {/* BACK BUTTON */}
      {/* ================================================= */}

      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-indigo-600 sm:text-sm"
        >
          <span className="text-lg leading-none">
            ←
          </span>

          Back
        </button>

      </div>

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <header>
        <div className="mx-auto max-w-7xl px-4 pb-5 pt-3 sm:px-6 sm:pb-7 sm:pt-4 lg:px-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Delivery Address
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Select or add your delivery address
              </p>
            </div>

            {/* STEPS */}

            <div className="flex items-center gap-2 self-start sm:gap-3">

              <div className="flex items-center gap-1.5 text-indigo-600 sm:gap-2">

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm">
                  1
                </span>

                <span className="text-xs font-semibold sm:text-sm">
                  Address
                </span>

              </div>

              <div className="h-px w-5 bg-slate-300 sm:w-8" />

              <div className="flex items-center gap-1.5 text-slate-400 sm:gap-2">

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold sm:h-8 sm:w-8 sm:text-sm">
                  2
                </span>

                <span className="text-xs sm:text-sm">
                  Payment
                </span>

              </div>

            </div>

          </div>

        </div>
      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">

        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-7">

          {/* ================================================= */}
          {/* LEFT SIDE */}
          {/* ================================================= */}

          <section className="min-w-0">

            <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Saved Addresses
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Choose where you want your order delivered
                </p>
              </div>

              <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600 sm:text-xs">
                {addresses.length} Saved
              </span>

            </div>

            {/* ================================================= */}
            {/* CURRENT LOCATION */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-70 sm:mb-5 sm:p-5"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white shadow-sm sm:h-11 sm:w-11">

                {locationLoading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "📍"
                )}

              </div>

              <div className="min-w-0 flex-1">

                <h3 className="text-sm font-bold text-indigo-700 sm:text-base">
                  {locationLoading
                    ? "Getting your current location..."
                    : "Use Current Location"}
                </h3>

                <p className="mt-1 text-xs leading-5 text-indigo-600/80 sm:text-sm">
                  {locationLoading
                    ? "Please wait while we find your location"
                    : "Automatically detect your address using GPS"}
                </p>

              </div>

              <span className="hidden text-indigo-600 sm:block">
                →
              </span>

            </button>

            {/* LOCATION ERROR */}

            {locationError && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                {locationError}
              </div>
            )}

            {/* ================================================= */}
            {/* ADDRESS CARDS */}
            {/* ================================================= */}

            <div className="space-y-4">

              {addresses.map((address) => {

                const isSelected =
                  selectedAddress ===
                  address._id;

                return (
                  <div
                    key={address._id}
                    onClick={() =>
                      setSelectedAddress(
                        address._id
                      )
                    }
                    className={`w-full cursor-pointer rounded-2xl border bg-white p-4 transition sm:p-5 ${
                      isSelected
                        ? "border-indigo-500 shadow-md shadow-indigo-100"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >

                    <div className="flex gap-3 sm:gap-4">

                      {/* RADIO */}

                      <div className="pt-1">

                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-indigo-600"
                              : "border-slate-300"
                          }`}
                        >

                          {isSelected && (
                            <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                          )}

                        </div>

                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                            {address.name}
                          </h3>

                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                            {address.type}
                          </span>

                          {isSelected && (
                            <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                              ✓ Selected
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                          {address.phone}
                        </p>

                        <p className="mt-2 break-words text-xs leading-5 text-slate-700 sm:text-sm sm:leading-6">

                          {address.address},{" "}
                          {address.city
                            ? `${address.city}, `
                            : ""}
                          {address.state},{" "}
                          {address.country} -{" "}

                          <span className="font-semibold text-slate-900">
                            {address.pincode}
                          </span>

                        </p>

                        {/* EDIT / REMOVE */}

                        <div className="mt-4 flex flex-wrap gap-4">

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditAddress(
                                address
                              );
                            }}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 sm:text-sm"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(
                                address._id
                              );
                            }}
                            className="text-xs font-semibold text-red-500 hover:text-red-600 sm:text-sm"
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>

                    {/* DELIVER HERE */}

                    {isSelected && (
                      <div className="mt-4 border-t border-slate-100 pt-4">

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            continueToPayment();
                          }}
                          className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
                        >
                          Deliver Here
                        </button>

                      </div>
                    )}

                  </div>
                );
              })}

              {/* ================================================= */}
              {/* ADD NEW ADDRESS */}
              {/* ================================================= */}

              <button
                type="button"
                onClick={openAddAddress}
                className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-4 text-left transition hover:border-indigo-400 hover:bg-indigo-50/30 sm:gap-4 sm:p-5"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600 sm:h-11 sm:w-11">
                  +
                </div>

                <div className="min-w-0">

                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    Add New Address
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Save another delivery address
                  </p>

                </div>

              </button>

            </div>

          </section>

          {/* ================================================= */}
          {/* RIGHT - ORDER SUMMARY */}
          {/* ================================================= */}

          <aside className="min-w-0">

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-20">

              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>

              {/* PRODUCT */}

              <div className="mt-5 flex gap-3 border-b border-slate-100 pb-5">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xl sm:h-16 sm:w-16 sm:text-2xl">

                  {product?.images?.length ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200">
                      📦
                    </div>
                  )}

                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {product
                      ? product.name
                      : "Loading..."}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {product
                      ? product.description
                      : "Loading..."}
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {product
                      ? `₹${product.originalPrice}`
                      : "Loading..."}
                  </p>

                </div>

              </div>

              {/* PRICE DETAILS */}

              <div className="space-y-3 border-b border-slate-100 py-5">

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Product Price
                  </span>

                  <span className="font-medium text-slate-900">
                    {product
                      ? `₹${product.originalPrice}`
                      : "Loading..."}
                  </span>

                </div>

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Delivery
                  </span>

                  <span className="font-semibold text-emerald-600">
                    FREE
                  </span>

                </div>

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Discount
                  </span>

                  <span className="font-semibold text-emerald-600">
                    {product
                      ? `₹${
                          product.originalPrice -
                          product.price
                        }`
                      : "Loading..."}
                  </span>

                </div>

              </div>

              {/* TOTAL */}

              <div className="flex items-center justify-between gap-4 py-5">

                <span className="font-bold text-slate-900">
                  Total Amount
                </span>

                <span className="text-lg font-bold text-slate-900">
                  {product
                    ? `₹${product.price}`
                    : "Loading..."}
                </span>

              </div>

              {/* PAYMENT BUTTON */}

              <button
                type="button"
                disabled={!selectedAddress}
                onClick={continueToPayment}
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-base"
              >
                Continue to Payment
              </button>

              <p className="mt-4 text-center text-xs text-slate-400">
                🔒 Safe & secure checkout
              </p>

            </div>

          </aside>

        </div>

      </main>

      {/* ================================================= */}
      {/* ADD / EDIT ADDRESS MODAL */}
      {/* ================================================= */}

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4">

          <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[92vh] sm:max-w-lg sm:rounded-2xl">

            {/* MODAL HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-4 sm:px-6 sm:py-5">

              <div className="min-w-0">

                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  {editingId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter your delivery details
                </p>

              </div>

              <button
                type="button"
                onClick={closeAddressModal}
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <div className="overflow-y-auto">

              <form
                onSubmit={handleSubmit}
                className="space-y-4 p-4 sm:p-6"
              >

                {/* CURRENT LOCATION */}

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {locationLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />

                      Getting your location...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">
                        📍
                      </span>

                      Use Current Location
                    </>
                  )}

                </button>

                {/* LOCATION ERROR */}

                {locationError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-600">
                    {locationError}
                  </p>
                )}

                {/* NAME + PHONE */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

                {/* COUNTRY */}

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >

                  <option value="">
                    Select Country
                  </option>

                  {countries.map(
                    (country) => (
                      <option
                        key={country}
                        value={country}
                      >
                        {country}
                      </option>
                    )
                  )}

                </select>

                {/* ADDRESS */}

                <textarea
                  name="address"
                  placeholder="House No, Building, Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                {/* STATE */}

                {formData.country ===
                "India" ? (
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="">
                      Select State / UT
                    </option>

                    {states.map(
                      (state) => (
                        <option
                          key={state}
                          value={state}
                        >
                          {state}
                        </option>
                      )
                    )}

                  </select>
                ) : (
                  <input
                    type="text"
                    name="state"
                    placeholder="State / Province / Region"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                )}

                {/* PINCODE */}

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode / ZIP Code"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                {/* ADDRESS TYPE */}

                <div>

                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    Address Type
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {["Home", "Work"].map(
                      (type) => (
                        <label
                          key={type}
                          className={`cursor-pointer rounded-xl border px-5 py-3 text-sm font-medium transition ${
                            formData.type ===
                            type
                              ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >

                          <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={
                              formData.type ===
                              type
                            }
                            onChange={
                              handleChange
                            }
                            className="hidden"
                          />

                          {type}

                        </label>
                      )
                    )}

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">

                  <button
                    type="button"
                    onClick={
                      closeAddressModal
                    }
                    disabled={
                      savingAddress
                    }
                    className="w-full rounded-xl bg-slate-100 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      savingAddress
                    }
                    className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                  >
                    {savingAddress
                      ? "Saving..."
                      : editingId
                      ? "Update Address"
                      : "Save Address"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AddressPage;