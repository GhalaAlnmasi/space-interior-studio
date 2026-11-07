import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24 md:py-36">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage-deep">Missing page</p>
      <h1 className="mt-5 max-w-3xl font-display text-[clamp(3.2rem,8vw,6rem)] leading-[0.9] tracking-[-0.035em]">
        This room is not on the plan.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
        The address does not match a page in the studio. The studies and the model are still here.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Return home</Button>
        <Button href="/spaces" variant="secondary">
          View spaces
        </Button>
      </div>
    </Container>
  );
}
