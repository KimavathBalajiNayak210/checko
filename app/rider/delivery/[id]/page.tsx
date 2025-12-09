import { DeliveryDetailContent } from "@/components/rider/delivery-detail-content"

export default async function DeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DeliveryDetailContent id={id} />
}
