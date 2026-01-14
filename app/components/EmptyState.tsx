"use client";

import { useRouter } from "next/navigation";
import { Heading } from "./Heading";
import { Button } from "./Button";

interface EmptyState {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

export const EmptyState: React.FC<EmptyState> = ({
  title = "Aucune correspondances trouvées",
  subtitle = "Essayez de modifier ou de supprimer certains de vos critères",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Supprimer les filtres"
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
};
