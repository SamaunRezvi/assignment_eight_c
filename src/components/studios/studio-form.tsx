"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AmenitiesField } from "@/components/studios/amenities-field";
import { CoverImageField, GalleryField } from "@/components/studios/image-fields";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/constants";
import { studioFormSchema, type StudioFormValues } from "@/lib/validation/studio";

const EMPTY_VALUES: StudioFormValues = {
  title: "",
  category: "photo-studio",
  hourlyRate: 50,
  securityDeposit: 100,
  maxCapacity: 10,
  location: { address: "", city: "" },
  image: "",
  gallery: [],
  amenities: [],
  overview: "",
};

interface StudioFormProps {
  host: { name: string; email: string };
  initialValues?: StudioFormValues;
  submitLabel: string;
  pendingLabel: string;
  pending: boolean;
  onSubmit: (values: StudioFormValues) => void | Promise<void>;
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function StudioForm({ host, initialValues, submitLabel, pendingLabel, pending, onSubmit }: StudioFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudioFormValues>({
    resolver: zodResolver(studioFormSchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <Section title="Host details" description="These come from your account and cannot be edited here.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Host name" htmlFor="host-name">
            <Input id="host-name" value={host.name} readOnly className="h-11 bg-muted/60" />
          </FormField>
          <FormField label="Host email" htmlFor="host-email">
            <Input id="host-email" value={host.email} readOnly className="h-11 bg-muted/60" />
          </FormField>
        </div>
      </Section>

      <Section title="The basics" description="Tell creators what kind of space this is and where to find it.">
        <FormField label="Studio title" htmlFor="title" error={errors.title?.message}>
          <Input id="title" placeholder="Northlight Cyclorama Studio" className="h-11" aria-invalid={Boolean(errors.title)} {...register("title")} />
        </FormField>

        <FormField label="Category" htmlFor="category" error={errors.category?.message}>
          <NativeSelect id="category" className="h-11" aria-invalid={Boolean(errors.category)} {...register("category")}>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Location / street address" htmlFor="address" error={errors.location?.address?.message}>
            <Input id="address" placeholder="214 Mercer Street, Unit 3" className="h-11" aria-invalid={Boolean(errors.location?.address)} {...register("location.address")} />
          </FormField>
          <FormField label="City" htmlFor="city" error={errors.location?.city?.message}>
            <Input id="city" placeholder="New York" className="h-11" aria-invalid={Boolean(errors.location?.city)} {...register("location.city")} />
          </FormField>
        </div>
      </Section>

      <Section title="Pricing & capacity" description="Transparent pricing helps creators book with confidence.">
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Hourly rate ($)" htmlFor="hourlyRate" error={errors.hourlyRate?.message}>
            <Input id="hourlyRate" type="number" min={1} step="0.01" inputMode="decimal" className="h-11" aria-invalid={Boolean(errors.hourlyRate)} {...register("hourlyRate", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Security deposit ($)" htmlFor="securityDeposit" error={errors.securityDeposit?.message}>
            <Input id="securityDeposit" type="number" min={0} step="0.01" inputMode="decimal" className="h-11" aria-invalid={Boolean(errors.securityDeposit)} {...register("securityDeposit", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Max capacity" htmlFor="maxCapacity" error={errors.maxCapacity?.message}>
            <Input id="maxCapacity" type="number" min={1} inputMode="numeric" className="h-11" aria-invalid={Boolean(errors.maxCapacity)} {...register("maxCapacity", { valueAsNumber: true })} />
          </FormField>
        </div>
      </Section>

      <Section title="Photos" description="A bright, honest cover photo is the biggest driver of bookings.">
        <FormField label="Cover image URL" htmlFor="image" error={errors.image?.message}>
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <CoverImageField id="image" value={field.value} onChange={field.onChange} invalid={Boolean(errors.image)} />
            )}
          />
        </FormField>
        <FormField label="Gallery (optional)" htmlFor="gallery" error={errors.gallery?.message}>
          <Controller control={control} name="gallery" render={({ field }) => <GalleryField value={field.value} onChange={field.onChange} />} />
        </FormField>
      </Section>

      <Section title="Amenities & overview" description="Describe what is included and what makes the room special.">
        <FormField label="Amenities" htmlFor="amenities" error={errors.amenities?.message}>
          <Controller control={control} name="amenities" render={({ field }) => <AmenitiesField value={field.value} onChange={field.onChange} />} />
        </FormField>
        <FormField label="Detailed overview" htmlFor="overview" error={errors.overview?.message}>
          <Textarea
            id="overview"
            rows={6}
            placeholder="Describe the size, light, equipment, access and ideal uses for your space."
            aria-invalid={Boolean(errors.overview)}
            {...register("overview")}
          />
        </FormField>
      </Section>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="min-w-48" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
