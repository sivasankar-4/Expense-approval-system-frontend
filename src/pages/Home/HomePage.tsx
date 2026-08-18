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

import { ScrollReveal, ScrollRevealContainer } from "@/components/common/ScrollReveal";
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
    <main className="min-h-screen bg-[#060403] text-[#F5F6F5]">
      <header className="bg-transparent border-b border-white/5 animate-in fade-in duration-500 relative z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#main-content" className="font-semibold tracking-tight text-[#F5F6F5]" aria-label="Expense Approval System home">
            Expense Approval System
          </a>
          <Button 
            onClick={goToLogin} 
            className="bg-[#B13A29] hover:bg-[#B13A29]/90 text-[#F5F6F5] rounded-full px-5 py-1.5 border-transparent font-medium text-xs sm:text-sm shadow-sm transition-all"
          >
            Sign In
          </Button>
        </div>
      </header>

      <div id="main-content">
        <section className="relative overflow-hidden border-b border-white/5 bg-[#060403]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none opacity-40"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-technology-background-loop-42289-large.mp4" type="video/mp4" />
          </video>
          {/* 80% Dark Overlay and 12px Backdrop Blur */}
          <div className="absolute inset-0 bg-[#060403]/80 backdrop-blur-[12px] z-0 pointer-events-none" />

          <ScrollRevealContainer threshold={0.05} className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8">
            <ScrollReveal variant="slide-up" duration={600} delay={50} className="max-w-2xl">
              <p className="mb-4 text-sm font-medium text-[#a09d9a]">A clear path for every expense</p>
              <h1 className="text-4xl font-semibold tracking-tight text-[#F5F6F5] sm:text-5xl lg:text-6xl">
                Expense approvals, organized.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#a09d9a] sm:text-lg">
                Expense Approval System gives teams a straightforward way to submit expenses, review requests, and keep decisions moving.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={goToLogin} className="bg-[#B13A29] hover:bg-[#B13A29]/90 text-[#F5F6F5] rounded-full border-transparent px-6 shadow-sm">
                  Get Started <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" aria-hidden="true" />
                </Button>
                <Button size="lg" variant="outline" onClick={goToLogin} className="rounded-full border-white/10 text-[#F5F6F5] hover:bg-white/5 hover:text-white px-6">
                  Sign In
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-up" duration={600} delay={200}>
              <Card className="bg-[#141211] border border-[rgba(255,255,255,0.08)] shadow-none transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-lg hover:border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-[#F5F6F5]">
                    <ShieldCheck className="size-5 text-[#F5F6F5]" aria-hidden="true" />
                    Built for accountable decisions
                  </CardTitle>
                  <CardDescription className="text-[#a09d9a]">
                    A focused workflow that keeps expense management clear for submitters, reviewers, and administrators.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-[#F5F6F5]/90">
                    {[
                      "Centralized expense records",
                      "Structured approval paths",
                      "Role-aware access control",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-[#F5F6F5] drop-shadow-[0_0_8px_#F5F6F5] filter" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </ScrollRevealContainer>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <ScrollReveal variant="slide-up" duration={600}>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#a09d9a]">Simple, accountable workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F5F6F5] sm:text-4xl">From request to resolution</h2>
            </div>
          </ScrollReveal>

          <ScrollRevealContainer className="mt-10 grid gap-4 md:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <li key={step.title} className="relative list-none">
                <ScrollReveal variant="slide-up" duration={500} delay={index * 75} className="h-full">
                  <Card className="h-full bg-[#141211] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-none transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-[#B13A29]/30 hover:shadow-[0_0_16px_rgba(177,58,41,0.15)]">
                    <CardHeader>
                      <span className="mb-3 text-sm font-semibold text-[#B13A29]">0{index + 1}</span>
                      <CardTitle className="text-[#F5F6F5]">{step.title}</CardTitle>
                      <CardDescription className="text-[#A1A1A4]">{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </ScrollReveal>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 bg-[#060403] text-white/30 md:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ScrollRevealContainer>
        </section>

        <section className="border-y border-white/5 bg-[#141211]/20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <ScrollReveal variant="slide-up" duration={600}>
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-[#a09d9a]">Designed for your operation</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F5F6F5] sm:text-4xl">Everything needed to manage expense approvals</h2>
              </div>
            </ScrollReveal>

            <ScrollRevealContainer className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }, index) => (
                <ScrollReveal key={title} variant="slide-up" duration={500} delay={index * 100}>
                  <Card className="bg-[#141211] border border-[rgba(255,255,255,0.08)] shadow-none transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-lg hover:border-white/20">
                    <CardHeader>
                      <Icon className="mb-2 size-5 text-[#B13A29]" aria-hidden="true" />
                      <CardTitle className="text-[#F5F6F5]">{title}</CardTitle>
                      <CardDescription className="text-[#a09d9a]">{description}</CardDescription>
                    </CardHeader>
                  </Card>
                </ScrollReveal>
              ))}
            </ScrollRevealContainer>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <ScrollReveal variant="slide-up" duration={600}>
            <h2 className="text-3xl font-semibold tracking-tight text-[#F5F6F5] sm:text-4xl">Ready to manage expenses with clarity?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#a09d9a]">
              Sign in to your workspace and keep every expense moving through the right approval process.
            </p>
            <Button size="lg" className="mt-8 bg-[#B13A29] hover:bg-[#B13A29]/90 text-[#F5F6F5] rounded-full px-6 border-transparent shadow-sm" onClick={goToLogin}>
              Enter the application <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" aria-hidden="true" />
            </Button>
          </ScrollReveal>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
