export type Motorcycle = {
  id: number;
  brand: string;
  model: string;
  version: string | null;
  year: number;
  mileage: number;
  displacementCc: number;
  price: number;
  category: string;
  city: string;
  state: string;
  sellerType: "PRIVATE" | "DEALER";
  sellerName: string;
  verifiedSeller: boolean;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
  createdAt: string;
};

export type SearchFilters = {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  yearFrom?: number;
  yearTo?: number;
  minCc?: number;
  maxCc?: number;
  maxMileage?: number;
  city?: string;
  state?: string;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
};

export type UpdateProfileInput = {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
};

export type AuthResponse = {
  token: string;
  tokenType: "Bearer";
  user: UserProfile;
};

export type ApiError = Error & {
  status?: number;
};
