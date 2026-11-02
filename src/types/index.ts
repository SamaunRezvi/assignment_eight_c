export type StudioCategory =
  | "photo-studio"
  | "film-stage"
  | "podcast-lounge"
  | "music-suite"
  | "workshop";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Studio {
  id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: { address: string; city: string };
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  host: { id: string; name: string; photo: string };
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  /** Present only when the signed-in user owns the studio. */
  ownerEmail?: string;
}

export interface Review {
  id: string;
  studioId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  guestName: string;
  guestEmail: string;
  hostEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  guests: number;
  hourlyRate: number;
  subtotal: number;
  securityDeposit: number;
  total: number;
  note: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

export interface DashboardSummary {
  host: {
    listings: number;
    bookingsByStatus: Record<BookingStatus, number>;
    revenue: number;
    monthly: Array<{ month: string; revenue: number; bookings: number }>;
  };
  guest: {
    bookingsByStatus: Record<BookingStatus, number>;
    totalSpent: number;
    wishlist: number;
  };
}

export type StudioSort = "newest" | "top-rated" | "price-asc" | "price-desc";

export interface StudioFilters {
  q?: string;
  category?: StudioCategory;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  sort?: StudioSort;
  page?: number;
  limit?: number;
}
