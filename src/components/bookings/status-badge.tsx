import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant="outline" className={cn("px-2.5 py-1 font-semibold", BOOKING_STATUS_STYLES[status])}>
      {status}
    </Badge>
  );
}
