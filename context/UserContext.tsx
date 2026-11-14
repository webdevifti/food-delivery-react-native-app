import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type AddressLabel = "Home" | "Work" | "Other";

export type Address = {
  id: string;
  label: AddressLabel;
  address: string;
  street: string;
  postCode: string;
  apartment: string;
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  /** Local image URI of the profile photo; undefined = default avatar. */
  photo?: string;
};

type UserContextValue = {
  profile: Profile;
  updateProfile: (changes: Partial<Profile>) => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, changes: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
};

const initialProfile: Profile = {
  name: "Eftekhar Alam",
  email: "example@mail.com",
  phone: "+8801912345678",
  bio: "I am food lover.",
};

const initialAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    address: "2464 Royal Ln, Meso",
    street: "Royal Ln",
    postCode: "45463",
    apartment: "",
  },
  {
    id: "2",
    label: "Work",
    address: "2464 Royal Ln, Meso",
    street: "Royal Ln",
    postCode: "45463",
    apartment: "",
  },
];

const UserContext = createContext<UserContextValue | null>(null);

/**
 * In-memory user state shared by the profile screens. Swap the internals for
 * an API / persistent storage once a backend exists; screens won't change.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(initialProfile);
  const [addresses, setAddresses] = useState(initialAddresses);

  const updateProfile = useCallback(
    (changes: Partial<Profile>) => setProfile((p) => ({ ...p, ...changes })),
    [],
  );
  const addAddress = useCallback(
    (address: Omit<Address, "id">) =>
      setAddresses((list) => [...list, { ...address, id: String(Date.now()) }]),
    [],
  );
  const updateAddress = useCallback(
    (id: string, changes: Omit<Address, "id">) =>
      setAddresses((list) =>
        list.map((a) => (a.id === id ? { ...changes, id } : a)),
      ),
    [],
  );
  const deleteAddress = useCallback(
    (id: string) => setAddresses((list) => list.filter((a) => a.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      addresses,
      addAddress,
      updateAddress,
      deleteAddress,
    }),
    [profile, updateProfile, addresses, addAddress, updateAddress, deleteAddress],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
