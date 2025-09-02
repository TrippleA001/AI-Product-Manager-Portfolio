import { useEffect, useRef, useCallback, useState } from "react";
import { 
  Target, 
  Brain, 
  Globe, 
  TrendingUp, 
  Users, 
  Wrench, 
  Star, 
  Mail, 
  Linkedin, 
  Download, 
  ArrowRight, 
  CheckCircle, 
  Check,
  Network,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from "@/components/ui/button";

const Icon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`text-4xl pr-4 ${className}`}>{children}</span>
);

const PDFCarousel = ({ documents }: { documents: string[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
    
    autoScrollIntervalRef.current = setInterval(() => {
      if (emblaApi && !isHovered) {
        emblaApi.scrollNext();
      }
    }, 5000); // 5 second interval
  }, [emblaApi, isHovered]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);

    // Start auto-scroll
    startAutoScroll();

    return () => {
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
      stopAutoScroll();
    };
  }, [emblaApi, onSelect, startAutoScroll, stopAutoScroll]);

  // Restart auto-scroll when hover state changes
  useEffect(() => {
    startAutoScroll();
  }, [isHovered, startAutoScroll]);

  return (
    <div 
      className="relative bg-card/50 rounded-xl border border-border p-6 mt-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-card-foreground flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Supporting Documents
        </h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollPrev}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollNext}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            data-testid="button-carousel-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {documents.map((doc, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 pr-4">
              <div className="bg-gradient-to-br from-muted/10 to-muted/30 border border-border/50 rounded-lg p-8 text-center hover:shadow-lg transition-all duration-300 min-h-[200px] flex flex-col justify-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h5 className="font-semibold text-card-foreground mb-2 text-lg" data-testid={`text-pdf-title-${index}`}>
                  {doc}
                </h5>
                <p className="text-sm text-muted-foreground mb-4">
                  PDF Document • Page {index + 1} of {documents.length}
                </p>
                <Button variant="default" size="sm" className="mx-auto" data-testid={`button-view-pdf-${index}`}>
                  <Download className="w-4 h-4 mr-2" />
                  View Full Document
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LinkedIn-style Progress Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {documents.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-primary w-8' 
                : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
            }`}
            onClick={() => scrollTo(index)}
            data-testid={`button-indicator-${index}`}
          />
        ))}
      </div>

      {/* Auto-scroll indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {!isHovered && (
          <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-1"></div>
            Auto
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ 
  title, 
  children, 
  className = "", 
  id 
}: { 
  title: React.ReactNode; 
  children: React.ReactNode; 
  className?: string;
  id?: string;
}) => (
  <div id={id} className={`my-8 p-6 bg-card dark:bg-card rounded-2xl shadow-lg border border-border ${className}`}>
    <h2 className="text-3xl font-bold mb-6 flex items-center text-card-foreground">
      {title}
    </h2>
    {children}
  </div>
);

const CaseStudy = ({ 
  title, 
  role, 
  challenge, 
  process, 
  solution, 
  impact,
  icon: IconComponent,
  iconBg,
  documents
}: {
  title: string;
  role: string;
  challenge: string;
  process: string[];
  solution: string;
  impact: string[];
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  documents: string[];
}) => (
  <div className="mb-16">
    <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300">
      <div className="p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8">
          <div className={`${iconBg} p-4 rounded-xl`}>
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2 text-[#fcfcfc]">{title}</h3>
            <p className="text-lg text-primary font-semibold">{role}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-destructive/5 border-l-4 border-destructive p-6 rounded-r-lg">
              <h4 className="font-bold text-destructive mb-3">The Challenge</h4>
              <p className="text-card-foreground leading-relaxed italic">"{challenge}"</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-card-foreground">The Process</h4>
              <ul className="space-y-3 text-card-foreground">
                {process.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
              <h4 className="font-bold text-primary mb-3">The Solution</h4>
              <p className="text-card-foreground leading-relaxed">{solution}</p>
            </div>

            <div className="bg-accent/5 p-6 rounded-xl">
              <h4 className="font-bold text-accent mb-4">The Impact</h4>
              <ul className="space-y-2 text-card-foreground font-bold">
                {impact.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <PDFCarousel documents={documents} />
      </div>
    </div>
  </div>
);

const Skill = ({ title, items }: { title: string; items: string[] }) => (
  <div className="bg-card p-8 rounded-xl shadow-lg border border-border hover:shadow-xl transition-all">
    <h3 className="text-2xl font-bold mb-6 text-[#f0f1f2]">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-center text-card-foreground">
          <Check className="w-4 h-4 text-accent mr-3" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border text-[#eded37]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="font-bold text-xl text-primary" data-testid="nav-brand">
            Abduljaleel Abdulsamad - Technical Product Manager (AI)
          </div>
          <div className="hidden md:flex space-x-8">
            <a 
              href="#about" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-about"
            >
              About
            </a>
            <a 
              href="#impact" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-impact"
            >
              Impact Stories
            </a>
            <a 
              href="#skills" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-skills"
            >
              Skills
            </a>
            <a 
              href="#contact" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Home = () => {
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.animate-fade-in');
    cards.forEach(card => {
      observerRef.current?.observe(card);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      {/* Hero Section */}
      <section id="about" className="gradient-bg hero-pattern py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full scale-110 blur-sm"></div>
                <img 
                  src="/assets/portrait.png" 
                  alt="Abduljaleel Abdulsamad - Product Manager" 
                  className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                  data-testid="img-headshot"
                />
              </div>
            </div>
            
            <div className="flex-1 text-center lg:text-left text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white" data-testid="text-hero-title">
                Building Impact Through
                <span className="block text-yellow-300">Data & AI</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white leading-relaxed max-w-3xl" data-testid="text-hero-subtitle">
                Product Manager with 5+ years crafting data-driven solutions across 
                <strong className="text-yellow-300 font-semibold"> AI, fintech, education, and healthcare </strong> 
                that democratize access and empower emerging markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="#impact" 
                  className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg"
                  data-testid="button-view-impact"
                >
                  <span className="text-[#171515]">View Impact Stories</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a 
                  href="#contact" 
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all"
                  data-testid="button-contact"
                >
                  <span>Get In Touch</span>
                  <Mail className="ml-2 w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Impact Overview */}
      <section className="py-16 text-[#2bf0e1] bg-[#1f1111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2" data-testid="metric-grading-errors">
              <div className="text-4xl font-bold metric-highlight text-[#2be2ad]">70%</div>
              <div className="text-sm text-muted-foreground">Reduced Grading Errors</div>
            </div>
            <div className="space-y-2" data-testid="metric-user-activation">
              <div className="text-4xl font-bold metric-highlight text-[#2be2ad]">40%</div>
              <div className="text-sm text-muted-foreground">Increased User Activation</div>
            </div>
            <div className="space-y-2" data-testid="metric-completion-rate">
              <div className="text-4xl font-bold metric-highlight text-[#2be2ad]">90%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="space-y-2" data-testid="metric-on-time-delivery">
              <div className="text-4xl font-bold metric-highlight text-[#2be2ad]">100%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Impact Stories Section */}
        <section id="impact" className="py-20 text-[#2bf0e1]">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="inline-flex items-center">
                <Target className="w-12 h-12 text-accent mr-4" />
                My Impact Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real results from complex challenges across AI, fintech, healthcare, and emerging markets
            </p>
          </div>

          <div className="animate-fade-in">
            <CaseStudy
              title="GradRai – AI-Powered Grading & Analytics Platform"
              role="AI Product & Technical Project Manager"
              challenge="University lecturers struggled with time-intensive, inconsistent grading that delayed feedback and hurt student satisfaction."
              process={[
                "Scoped requirements through faculty & student interviews (50+)",
                "Led full product lifecycle with 15-person cross-functional team across 4 time zones",
                "Managed Agile methodology ensuring on-time delivery across developers, data scientists, designers, and QA",
                "Collaborated directly with AI engineers to build scalable solution handling 200+ scripts simultaneously",
                "Integrated AI grading models + Power BI dashboards to automate feedback and track learner engagement",
                "Conducted onboarding sessions with lecturers and piloted across 3 faculties",
                "Designed internal GTM strategy via faculty academic councils & departmental buy-in"
              ]}
              solution="Launched automated grading and feedback platform with real-time Power BI dashboards tracking AI accuracy and learner engagement."
              impact={[
                "Cut grading time for lecturers by 90% while maintaining 95% accuracy",
                "Increased student satisfaction by 25% (surveyed post-pilot)",
                "Increased student performance by 60% by providing personalized feedback",
                "Adopted by 5 departments, covering 2,000+ students in one semester"
              ]}
              icon={Brain}
              iconBg="bg-accent/10 text-accent"
              documents={["AI Model Architecture Overview", "Product Roadmap & KPI Dashboard", "Team Performance Metrics"]}
            />
          </div>

          <div className="animate-fade-in">
            <CaseStudy
              title="Afripay – EduFinTech Cross-Border Payment Platform"
              role="Technical Product Manager"
              challenge="Afripay aimed to expand its payment platform to serve students and institutions across Africa, but faced fragmented regulation, inconsistent infrastructure and unreliable transaction visibility."
              process={[
                "Oversaw 4 concurrent projects across Nigeria, Ghana, Kenya, and Finland",
                "Led user onboarding research to optimize payment routing, KYC flow, and multi-country compliance",
                "Managed distributed team across 4 time zones, reducing feature delivery from 10 to 2 weeks",
                "Collaborated with regulators & compliance officers to embed KYC/AML requirements into product roadmap",
                "Coordinated product, design, sales, and dev teams to prioritize features",
                "Coordinated cross-border payment API integrations and partnerships with fintechs and educational bodies",
                "Introduced real-time KPI dashboards for monitoring transactions",
                "Launched targeted pilot campaigns with 3 universities to onboard students and schools"
              ]}
              solution="Delivered four major product rollouts, including a streamlined payment platform serving users across 10 African countries."
              impact={[
                "Processed $2M+ in student tuition & cross-border transactions in first 6 months",
                "Increased processing efficiency by 70%; reduced compliance errors by 55%",
                "Achieved 25K new user signups through university partnerships",
                "Rolled out cross-country within 3 months"
              ]}
              icon={Globe}
              iconBg="bg-primary/10 text-primary"
              documents={["Cross-Border Payment Strategy", "KYC Process Optimization Report", "Multi-Country Compliance Framework"]}
            />
          </div>

          <div className="animate-fade-in">
            <CaseStudy
              title="Webfala Women in AI Fellowship"
              role="AI & Product Faculty Lead"
              challenge="AI access in Nigeria remained concentrated in major cities like Lagos/Abuja, leaving women outside urban hubs excluded from opportunities. Most trainings in Nigeria focus on coding skills, requiring participant to seek employments rather than build viable solutions to local problems."
              process={[
                "Designed & delivered a 6-month AI fellowship for 20 female fellows covering the full product lifecycle: user research, design thinking, MVP scoping, agile sprints, pitching.",
                "Led workshops on AI use cases in healthcare, fintech, and education, emphasizing privacy & ethical AI use",
                "Coached fellows on storytelling and pitch decks for hackathons and demo sessions",
                "Partnered with funding sponsors & local ecosystem hubs to secure resources",
                "Designed recruitment funnel: 200+ applications → 20 fellows accepted (10% acceptance)"
              ]}
              solution="Successfully equipped 20 women with solution-oriented AI skills, culminating in 5 AI-driven community initiatives."
              impact={[
                "90% completion rate",
                "3 fellows secured funded internships, 2 launched AI-powered startups",
                "Fellowship attracted 15,000+ online audience for Demo Day",
                "Framework validated and being scaled to 100+ women for 2026 cohort"
              ]}
              icon={Users}
              iconBg="bg-primary/10 text-primary"
              documents={["Fellowship Curriculum Design", "Community Impact Assessment", "Funding Partner Proposals"]}
            />
          </div>

          <div className="animate-fade-in">
            <CaseStudy
              title="Rice360 Global Health Research – Neonatal Mortality Tools"
              role="Research Assistant"
              challenge="Nigeria has one of the world's highest neonatal mortality rates. Clinics lacked low-cost tools to identify at-risk newborns and prevent infection."
              process={[
                "Worked with clinicians & engineers to design IoT neonatal monitoring prototypes",
                "Contributed to 2 low-cost devices: smart weighing scale and 3D-printed sterilized umbilical cord clamp",
                "Conducted data analysis on neonatal survival rates",
                "Presented findings in academic posters & reports at Rice University forums"
              ]}
              solution="Developed low-cost IoT monitoring prototypes and 3D-printed medical devices for neonatal care."
              impact={[
                "Prototypes tested in simulation labs with clinicians validating usability",
                "Estimated 70% cost savings compared to imported alternatives",
                "Drafted 2 research reports & 1 poster presentation shared with global health partners"
              ]}
              icon={Brain}
              iconBg="bg-accent/10 text-accent"
              documents={["Neonatal Monitoring Research Report", "IoT Prototype Specifications", "Global Health Partnership Proposals"]}
            />
          </div>

          <div className="animate-fade-in">
            <CaseStudy
              title="MedHUB – Smart Hospital & Patient Management System"
              role="AI Engineer & Technical Product Manager"
              challenge="Hospitals struggled with drug monitoring, appointment scheduling, and symptom tracking due to siloed data systems."
              process={[
                "Led a 10-person Agile team (backend, frontend, data, design, cybersecurity)",
                "Developed AI modules for symptom prediction, reminders, and drug adherence",
                "Coordinated with doctors, nurses, and IT staff to ensure usability",
                "Designed MVP go-live plan including training sessions & onboarding workflows"
              ]}
              solution="Launched comprehensive hospital management system with AI-powered patient monitoring and appointment optimization."
              impact={[
                "Improved appointment adherence by 45%",
                "Reduced medication errors by 30%",
                "Onboarded 500+ patients in pilot hospitals within 3 months",
                "Delivered MVP in 4 months, paving way for Series-A funding pitch"
              ]}
              icon={TrendingUp}
              iconBg="bg-accent/10 text-accent"
              documents={["AI Module Architecture", "Hospital Integration Guide", "Series-A Funding Pitch Deck"]}
            />
          </div>


        </section>
        
        {/* Skills & Vision Section */}
        <section id="skills" className="py-20 bg-muted/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 text-[#2bf0e1]">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="inline-flex items-center">
                <Wrench className="w-12 h-12 text-accent mr-4" />
                Skills & Vision
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive expertise spanning product management, AI development, healthcare innovation, and strategic leadership
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 animate-fade-in">
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <Skill
                title="Product Management"
                items={["Agile Project Delivery", "Strategic Roadmapping", "Stakeholder Alignment", "User Research & Analytics", "Scrum & Sprint Management"]}
              />
            </div>
            
            <div className="flex items-center">
              <div className="bg-accent/10 p-3 rounded-lg mr-4">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <Skill
                title="Data & AI"
                items={["AI Model Development", "Predictive Analytics", "Data Visualization (Power BI)", "Python & SQL Programming", "Machine Learning Pipelines"]}
              />
            </div>
            
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <Skill
                title="Project Leadership"
                items={["Cross-functional Team Leadership", "Workflow Automation", "Project Scoping & Planning", "Budget & Resource Management"]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center">
              <div className="bg-accent/10 p-3 rounded-lg mr-4">
                <Network className="w-6 h-6 text-accent" />
              </div>
              <Skill
                title="Ecosystem Building"
                items={["Partnership Development", "Community Leadership", "Program Design & Implementation", "Stakeholder Engagement", "Impact Measurement"]}
              />
            </div>

            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <Skill
                title="Healthcare Innovation"
                items={["Medical Device Development", "Clinical Workflow Optimization", "Patient Data Management", "Regulatory Compliance", "Medical IoT Solutions"]}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary to-accent p-8 lg:p-12 rounded-2xl text-white animate-fade-in">
            <div className="flex items-center mb-6">
              <Star className="w-8 h-8 mr-4" />
              <h3 className="text-3xl font-bold">Vision Forward</h3>
            </div>
            <p className="text-xl leading-relaxed" data-testid="text-vision">
              I believe the next decade of innovation lies in AI-driven solutions for real human problems—from financial inclusion and education to healthcare and sustainable development. My goal is to lead product and data teams building scalable, ethical, and impactful technologies for emerging markets and beyond, with a particular focus on healthcare innovation and cross-border solutions.
            </p>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-20 bg-card -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-2xl text-[#eded37]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-card-foreground" data-testid="text-contact-title">
              Let's Build Impact Together
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto" data-testid="text-contact-subtitle">
              Ready to scale your product with data-driven solutions? Let's discuss how we can create meaningful impact in emerging markets, healthcare innovation, and cross-border solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <a 
                href="mailto:abduljaleel_abdulsamad@yahoo.com" 
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg"
                data-testid="button-email"
              >
                <Mail className="mr-3 w-5 h-5" />
                Send Email
              </a>
              <a 
                href="https://www.linkedin.com/in/abdul-samad-abdul-jaleel/" 
                className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-all"
                data-testid="button-linkedin"
              >
                <Linkedin className="mr-3 w-5 h-5" />
                LinkedIn Profile
              </a>
              <a 
                href="/resume.pdf" 
                className="inline-flex items-center px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-all"
                data-testid="button-resume"
              >
                <Download className="mr-3 w-5 h-5" />
                Download Resume
              </a>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-muted-foreground" data-testid="text-copyright">
                © 2024 Abduljaleel Abdulsamad. Championing real impact with AI products.
              </p>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default Home;
