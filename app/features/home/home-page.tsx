import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  PiggyBank,
  Receipt,
  TrendingUp,
  Shield,
  Users,
  Sparkles,
  Target,
  Wallet,
  ChartPie,
  LayoutDashboard,
  HomeIcon,
  CheckCircle,
  Star,
  Zap,
  Heart,
  Clock,
  DollarSign,
  Goal,
} from "lucide-react";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import {
  HeroHighlight,
  Highlight,
} from "~/common/components/aceternity/hero-highlight";
import {
  BentoGrid,
  BentoGridItem,
} from "~/common/components/aceternity/bento-grid";
import { BackgroundGradient } from "~/common/components/aceternity/background-gradient";
import { CardStack } from "~/common/components/aceternity/card-stack";
import { FloatingNav } from "~/common/components/aceternity/floating-navbar";

export default function HomePage() {
  const features = [
    {
      title: "월 고정수입 관리",
      description:
        "급여, 부수입 등 모든 수입원을 체계적으로 등록하고 관리하세요",
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      href: "/income",
      className: "md:col-span-1",
      header: (
        <div className="flex flex-col space-y-4">
          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      ),
    },
    {
      title: "월 고정지출 관리",
      description: "고정비와 변동비를 구분하여 카테고리별로 지출을 추적하세요",
      icon: <Receipt className="h-6 w-6 text-blue-600" />,
      href: "/expense",
      className: "md:col-span-1",
      header: (
        <div className="flex flex-col space-y-4">
          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
            <Receipt className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      ),
    },
    {
      title: "연간 비정기지출 예산",
      description:
        "여행, 선물, 교육비 등 비정기지출을 위한 예산을 세우고 관리하세요",
      icon: <ChartPie className="h-6 w-6 text-purple-600" />,
      href: "/budget",
      className: "md:col-span-1",
      header: (
        <div className="flex flex-col space-y-4">
          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center">
            <ChartPie className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      ),
    },
    {
      title: "저축 계획 및 목표",
      description: "여유 자금으로 저축 계획을 세우고 목표 달성률을 추적하세요",
      icon: <PiggyBank className="h-6 w-6 text-amber-600" />,
      href: "/goal",
      className: "md:col-span-2",
      header: (
        <div className="flex flex-col space-y-4">
          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 flex items-center justify-center">
            <PiggyBank className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      ),
    },
    {
      title: "통합 대시보드",
      description:
        "월 고정수입/지출, 연간 비정기지출 예산, 저축 계획 현황을 한눈에 확인하세요",
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      href: "/dashboard",
      className: "md:col-span-1",
      header: (
        <div className="flex flex-col space-y-4">
          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      ),
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "김민수",
      designation: "직장인",
      content: (
        <div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-normal mb-4">
            "MOA 덕분에 매월 수입과 지출을 체계적으로 관리할 수 있게 되었어요.
            예산 계획도 세우고 저축 목표도 달성하고 있습니다!"
          </p>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 2,
      name: "이영희",
      designation: "주부",
      content: (
        <div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-normal mb-4">
            "가족 전체가 함께 사용할 수 있어서 정말 좋아요. 각자의 지출도
            관리하고 공동 목표도 세울 수 있어요."
          </p>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 3,
      name: "박철수",
      designation: "프리랜서",
      content: (
        <div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-normal mb-4">
            "변동 수입이 많은 프리랜서에게 완벽한 도구예요. 비정기지출 예산
            관리가 특히 유용합니다."
          </p>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>
      ),
    },
  ];

  const steps = [
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      title: "수입 등록",
      description: "급여, 부수입 등 모든 수입원을 체계적으로 등록",
      features: ["월급 등록", "부수입 추가", "수입 추적"],
    },
    {
      icon: <Receipt className="h-6 w-6 text-blue-600" />,
      title: "지출 관리",
      description: "고정비와 변동비를 구분하여 카테고리별 관리",
      features: ["고정비 설정", "카테고리 관리", "지출 분석"],
    },
    {
      icon: <ChartPie className="h-6 w-6 text-purple-600" />,
      title: "예산 수립",
      description: "연간 비정기지출을 위한 예산 계획 및 관리",
      features: ["예산 계획", "지출 추적", "예산 분석"],
    },
    {
      icon: <PiggyBank className="h-6 w-6 text-amber-600" />,
      title: "목표 달성",
      description: "저축 목표 설정 및 진행 상황 추적",
      features: ["목표 설정", "진행률 확인", "저축 계획"],
    },
  ];

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <FloatingNav navItems={navItems} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-12 md:pb-20">
        <HeroHighlight className="py-8 px-4 md:py-20">
          <div className="container mx-auto text-center max-w-6xl">
            <Badge className="mb-4 md:mb-6" variant="secondary">
              <Sparkles className="mr-2 h-4 w-4" />
              가계부의 새로운 기준
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight px-2">
              <Highlight className="text-black dark:text-white">
                스마트한 가계 재정 관리
              </Highlight>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              수입과 지출을 체계적으로 관리하고, 예산을 계획하며, 저축 목표를
              달성하세요. 모든 가족 구성원이 함께 사용할 수 있는 통합 재정 관리
              플랫폼입니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
                asChild
              >
                <Link to="/auth/sign-up">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
                asChild
              >
                <Link to="/dashboard">
                  대시보드 둘러보기
                  <LayoutDashboard className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  10,000+
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  활성 사용자
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  ₩50억+
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  관리된 자산
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  99.9%
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  서비스 가동률
                </div>
              </div>
            </div>
          </div>
        </HeroHighlight>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 md:mb-6" variant="outline">
              <Zap className="mr-2 h-4 w-4" />
              주요 기능
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
              모든 재정 관리를 한 곳에서
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              복잡한 가계부는 이제 그만. 직관적이고 강력한 기능으로 재정 관리를
              시작하세요.
            </p>
          </div>

          <BentoGrid className="max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <BentoGridItem
                key={i}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                className={feature.className}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 md:mb-6" variant="outline">
              <Target className="mr-2 h-4 w-4" />
              이용 방법
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
              4단계로 시작하는 재정 관리
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              복잡한 설정 없이 바로 시작할 수 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-4 md:mb-6">
                  <div className="h-12 w-12 md:h-16 md:w-16 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs md:text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                  {step.description}
                </p>
                <div className="space-y-1 md:space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center justify-center space-x-2 text-xs md:text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-emerald-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 md:mb-6" variant="outline">
              <Heart className="mr-2 h-4 w-4" />
              사용자 후기
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
              실제 사용자들이 말하는 MOA
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              이미 많은 사용자들이 MOA로 더 나은 재정 관리를 경험하고 있습니다
            </p>
          </div>

          <div className="flex justify-center px-4">
            <CardStack items={testimonials} />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 md:mb-6" variant="outline">
              <Shield className="mr-2 h-4 w-4" />왜 MOA인가
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
              믿고 사용할 수 있는 이유
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              안전하고 직관적인 재정 관리의 새로운 경험을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
            <BackgroundGradient className="rounded-[22px] p-1">
              <Card className="border-0 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">가족 공유</CardTitle>
                  <CardDescription className="text-base">
                    여러 가족 구성원이 함께 사용하고 관리할 수 있는 다중 사용자
                    시스템
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">가족별 권한 관리</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">실시간 동기화</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">개인별 통계 제공</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </BackgroundGradient>

            <BackgroundGradient className="rounded-[22px] p-1">
              <Card className="border-0 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">안전한 데이터</CardTitle>
                  <CardDescription className="text-base">
                    철저한 보안과 프라이버시 보호로 안심하고 사용하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">데이터 암호화</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">자동 백업</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">접근 권한 제어</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </BackgroundGradient>

            <BackgroundGradient className="rounded-[22px] p-1">
              <Card className="border-0 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">스마트 분석</CardTitle>
                  <CardDescription className="text-base">
                    AI 기반 분석으로 더 나은 재정 결정을 내리세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">지출 패턴 분석</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">저축 목표 추천</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">예산 최적화</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 md:mb-6" variant="outline">
              <Wallet className="mr-2 h-4 w-4" />
              요금제
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
              합리적인 가격으로 시작하세요
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              모든 기능을 무료로 체험해보고, 필요에 따라 업그레이드하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
            <BackgroundGradient className="rounded-[22px] p-1">
              <Card className="border-0 h-full">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl">무료</CardTitle>
                  <CardDescription className="text-base">
                    개인 사용자를 위한 기본 플랜
                  </CardDescription>
                  <div className="text-4xl font-bold mt-4">₩0</div>
                  <div className="text-sm text-muted-foreground">평생 무료</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">기본 수입/지출 관리</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">월간 리포트</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">1개 계정</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">기본 예산 관리</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full mt-8"
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link to="/auth/sign-up">무료로 시작하기</Link>
                  </Button>
                </CardContent>
              </Card>
            </BackgroundGradient>

            <BackgroundGradient className="rounded-[22px] p-1">
              <Card className="border-0 h-full relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    인기
                  </Badge>
                </div>
                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-2xl">프로</CardTitle>
                  <CardDescription className="text-base">
                    가족과 함께 사용하는 프리미엄 플랜
                  </CardDescription>
                  <div className="text-4xl font-bold mt-4">
                    ₩9,900
                    <span className="text-lg font-normal text-muted-foreground">
                      /월
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    연간 결제 시 20% 할인
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">무제한 수입/지출 관리</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">AI 지출 분석</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">최대 5개 계정</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">고급 예산 계획 도구</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">저축 목표 설정</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">우선 지원</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-8" size="lg" asChild>
                    <Link to="/auth/sign-up">프로 시작하기</Link>
                  </Button>
                </CardContent>
              </Card>
            </BackgroundGradient>

            <BackgroundGradient className="rounded-[22px] p-1">
              <Card className="border-0 h-full">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl">비즈니스</CardTitle>
                  <CardDescription className="text-base">
                    소규모 사업자를 위한 플랜
                  </CardDescription>
                  <div className="text-4xl font-bold mt-4">
                    ₩29,900
                    <span className="text-lg font-normal text-muted-foreground">
                      /월
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    연간 결제 시 25% 할인
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">프로 플랜의 모든 기능</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">무제한 계정</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">세무 리포트</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">API 접근</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">전담 지원</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">커스텀 통합</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full mt-8"
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link to="/auth/sign-up">문의하기</Link>
                  </Button>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <BackgroundGradient className="rounded-[22px] p-1 max-w-4xl mx-auto">
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="p-8 md:p-16 text-center">
                <div className="h-16 w-16 md:h-20 md:w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center mb-6 md:mb-8">
                  <Goal className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
                  지금 바로 시작하세요
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                  복잡한 재정 관리를 간단하게. MOA와 함께 스마트한 가계부를
                  경험하세요. 무료로 시작하고 언제든지 업그레이드할 수 있습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-6 md:mb-8 px-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
                    asChild
                  >
                    <Link to="/auth/sign-up">
                      무료로 시작하기
                      <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
                    asChild
                  >
                    <Link to="/dashboard">
                      데모 둘러보기
                      <LayoutDashboard className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>신용카드 없이 무료로 시작</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>언제든 취소 가능</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>30일 무료 체험</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BackgroundGradient>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-primary">
                MOA
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                스마트한 가계 재정 관리의 시작. 수입과 지출을 체계적으로
                관리하고, 예산을 계획하며, 저축 목표를 달성하세요.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 md:mb-6 text-base md:text-lg">
                제품
              </h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    대시보드
                  </Link>
                </li>
                <li>
                  <Link
                    to="/income"
                    className="hover:text-primary transition-colors"
                  >
                    월 고정수입 관리
                  </Link>
                </li>
                <li>
                  <Link
                    to="/expense"
                    className="hover:text-primary transition-colors"
                  >
                    월 고정지출 관리
                  </Link>
                </li>
                <li>
                  <Link
                    to="/budget"
                    className="hover:text-primary transition-colors"
                  >
                    연간 비정기지출 예산
                  </Link>
                </li>
                <li>
                  <Link
                    to="/goal"
                    className="hover:text-primary transition-colors"
                  >
                    저축 계획 및 목표
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 md:mb-6 text-base md:text-lg">
                지원
              </h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    도움말 센터
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    시작 가이드
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    커뮤니티
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 md:mb-6 text-base md:text-lg">
                회사
              </h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    회사 소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    블로그
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    채용 정보
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-0">
              <p>© 2024 MOA. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center space-x-1 md:space-x-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4" />
                <span>24/7 지원</span>
              </span>
              <span className="flex items-center space-x-1 md:space-x-2">
                <Shield className="h-3 w-3 md:h-4 md:w-4" />
                <span>SSL 보안</span>
              </span>
              <span className="flex items-center space-x-1 md:space-x-2">
                <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                <span>무료 시작</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
