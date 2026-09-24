import { API_BASE_URL } from "@/lib/config";
import type { ApiError, AuthResponse, Motorcycle, SearchFilters, UpdateProfileInput, UserProfile } from "@/lib/types";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  let response: Response;
  try {
    const multipart = typeof FormData !== "undefined" && options.body instanceof FormData;
    response = await fetch(API_BASE_URL + path, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(!multipart ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...options.headers
      }
    });
  } catch {
    const error = new Error("Não foi possível conectar ao Giro Certo. Confira se a API está ativa.") as ApiError;
    throw error;
  }

  if (!response.ok) {
    let message = "Não foi possível concluir a solicitação.";
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // Keep the generic API error if the response has no JSON body.
    }
    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type ListingPhotoUpload = {
  uri: string;
  name: string;
  mimeType: string;
  file?: Blob;
};

export function resolveImageUrl(imageUrl: string) {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return new URL(imageUrl, API_BASE_URL).toString();
}

function toQuery(filters: SearchFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return query ? "?" + query : "";
}

export const api = {
  motorcycles: (filters: SearchFilters = {}) =>
    request<Motorcycle[]>("/motorcycles" + toQuery(filters)),
  motorcycle: (id: number) =>
    request<Motorcycle>("/motorcycles/" + id),
  createMotorcycle: (
    token: string,
    listing: Omit<Motorcycle, "id" | "createdAt" | "sellerType" | "sellerName" | "verifiedSeller" | "imageUrl" | "imageUrls"> & { imageUrl?: string },
    photos: ListingPhotoUpload[] = []
  ) => {
    if (photos.length === 0) {
      return request<Motorcycle>("/motorcycles", {
        method: "POST",
        body: JSON.stringify(listing)
      }, token);
    }

    const body = new FormData();
    Object.entries(listing).forEach(([key, value]) => {
      if (value !== undefined && value !== null) body.append(key, String(value));
    });
    photos.slice(0, 5).forEach((photo) => {
      if (photo.file) {
        body.append("photos", photo.file, photo.name);
      } else {
        body.append("photos", { uri: photo.uri, name: photo.name, type: photo.mimeType } as unknown as Blob);
      }
    });
    return request<Motorcycle>("/motorcycles", { method: "POST", body }, token);
  },
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    }),
  currentUser: (token: string) =>
    request<UserProfile>("/auth/me", {}, token),
  updateProfile: (token: string, profile: UpdateProfileInput) =>
    request<UserProfile>("/auth/me", {
      method: "PUT",
      body: JSON.stringify(profile)
    }, token),
  favorites: (token: string) =>
    request<Motorcycle[]>("/favorites", {}, token),
  addFavorite: (token: string, motorcycleId: number) =>
    request<void>("/favorites/" + motorcycleId, { method: "POST" }, token),
  removeFavorite: (token: string, motorcycleId: number) =>
    request<void>("/favorites/" + motorcycleId, { method: "DELETE" }, token)
};

export const demoMotorcycles: Motorcycle[] = [
  {
    id: 1, brand: "Honda", model: "CBR 600RR", version: "600RR", year: 2007,
    mileage: 42000, displacementCc: 600, price: 27990, category: "ESPORTIVA",
    city: "Belo Horizonte", state: "MG", sellerType: "PRIVATE",
    sellerName: "Vendedor particular", verifiedSeller: false,
    description: "Moto esportiva usada como exemplo para o catálogo local. Consulte o vendedor para confirmar os detalhes do anúncio.",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85",
    createdAt: "2026-09-24T12:00:00Z"
  },
  {
    id: 2, brand: "Kawasaki", model: "Ninja 300", version: "ABS", year: 2014,
    mileage: 50000, displacementCc: 300, price: 17990, category: "ESPORTIVA",
    city: "São Paulo", state: "SP", sellerType: "DEALER",
    sellerName: "Loja Giro Certo (demonstração)", verifiedSeller: true,
    description: "Anúncio demonstrativo de loja. Confirme histórico e condições diretamente com o vendedor.",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85",
    createdAt: "2026-09-23T12:00:00Z"
  },
  {
    id: 3, brand: "Yamaha", model: "XJ6N", version: "600", year: 2013,
    mileage: 38500, displacementCc: 600, price: 32500, category: "NAKED",
    city: "Goiânia", state: "GO", sellerType: "PRIVATE",
    sellerName: "Vendedor particular", verifiedSeller: false,
    description: "Anúncio demonstrativo para navegação e busca. Dados podem ser editados no backend.",
    imageUrl: "https://images.unsplash.com/photo-1558981852-426c6c22a060?auto=format&fit=crop&w=1200&q=85",
    createdAt: "2026-09-22T12:00:00Z"
  },
  {
    id: 4, brand: "Honda", model: "XRE 300 Rally", version: "ABS", year: 2021,
    mileage: 18000, displacementCc: 300, price: 25990, category: "TRAIL",
    city: "Curitiba", state: "PR", sellerType: "DEALER",
    sellerName: "Loja Giro Certo (demonstração)", verifiedSeller: true,
    description: "Anúncio demonstrativo de loja. Consulte o vendedor para informações atualizadas.",
    imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=85",
    createdAt: "2026-09-21T12:00:00Z"
  }
];
