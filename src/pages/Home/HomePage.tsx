import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const workflowSteps = [
  { title: "Submit", description: "Create and submit expense claims with the details your team needs." },
  { title: "Review", description: "Route submissions to the appropriate reviewers." },
  { title: "Approve or reject", description: "Make clear, accountable decisions at every stage." },
  { title: "Track", description: "Follow each expense from submission through resolution." },
];

const features = [
  {
    icon: FileText,
    title: "Expense Management",
    description: "Submit, view, and manage expense claims in one organized workspace.",
  },
  {
    icon: ClipboardCheck,
    title: "Approval Workflows",
    description: "Give reviewers a focused queue for timely, consistent decisions.",
  },
  {
    icon: UsersRound,
    title: "Role-Based Access",
    description: "Provide the right level of visibility and control for every user.",
  },
  {
    icon: Building2,
    title: "Multi-Tenant Architecture",
    description: "Keep each organization's workspace and data clearly separated.",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#main-content" className="font-semibold tracking-tight" aria-label="Expense Approval System home">
            Expense Approval System
          </a>
          <Button variant="outline" onClick={goToLogin}>
            Sign In
          </Button>
        </div>
      </header>

      <div id="main-content">
        <section className="border-b">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-medium text-muted-foreground">A clear path for every expense</p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Expense approvals, organized.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Expense Approval System gives teams a straightforward way to submit expenses, review requests, and keep decisions moving.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={goToLogin}>
                  Get Started <ArrowRight aria-hidden="true" />
                </Button>
                <Button size="lg" variant="outline" onClick={goToLogin}>
                  Sign In
                </Button>
              </div>
            </div>

            <Card className="border bg-muted/30 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                  Built for accountable decisions
                </CardTitle>
                <CardDescription>
                  A focused workflow that keeps expense management clear for submitters, reviewers, and administrators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Centralized expense records",
                    "Structured approval paths",
                    "Role-aware access control",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-foreground" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">Simple, accountable workflow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From request to resolution</h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <li key={step.title} className="relative">
                <Card className="h-full shadow-none">
                  <CardHeader>
                    <span className="mb-3 text-sm font-medium text-muted-foreground">0{index + 1}</span>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                </Card>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 bg-background text-muted-foreground md:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-muted-foreground">Designed for your operation</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything needed to manage expense approvals</h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="shadow-none">
                  <CardHeader>
                    <Icon className="mb-2 size-5" aria-hidden="true" />
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to manage expenses with clarity?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Sign in to your workspace and keep every expense moving through the right approval process.
          </p>
          <Button size="lg" className="mt-8" onClick={goToLogin}>
            Enter the application <ArrowRight aria-hidden="true" />
          </Button>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
