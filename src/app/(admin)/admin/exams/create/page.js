import { CreateBasicInfoForm } from "@/features/exams/components/create/create-basic-info-form";
import { ManageOnlineTestHeader } from "@/features/exams/components/create/manage-online-test-header";

export default function CreateOnlineTestPage() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <ManageOnlineTestHeader step="basic" />

      <div className="mx-auto w-full max-w-7xl">
        <CreateBasicInfoForm />
      </div>
    </section>
  );
}

