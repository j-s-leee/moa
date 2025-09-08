import { AnimatedThemeToggler } from "components/magicui/animated-theme-toggler";
import {
  CheckCircle,
  HeartHandshake,
  Menu,
  Play,
  Smartphone,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "부부 공동 관리",
      description: "파트너를 초대해서 함께 가계 재정을 투명하게 관리하세요",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "목표 기반 저축",
      description: "목표를 설정하고 저축 계획을 세워보세요",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "모바일 최적화",
      description: "언제 어디서나 편리하게 사용할 수 있습니다",
    },
  ];

  const testimonials = [
    {
      rating: 5,
      content:
        "MOA는 우리 가족의 재정 관리를 크게 개선했어요. 목표 달성을 위한 저축 계획을 세워보니 더 명확해졌어요.",
      name: "김철수",
      role: "신혼부부",
    },
    {
      rating: 5,
      content:
        "결혼 후 가계부를 함께 관리하면서 더 투명하게 재정을 관리할 수 있었어요. 목표 달성을 위한 저축 계획을 세워보니 더 명확해졌어요.",
      name: "김철수",
      role: "신혼부부",
    },
  ];

  const pricingPlans = [
    {
      name: "베이직",
      price: "무료",
      period: "",
      features: [
        "기본 가계부 기능",
        "1명 사용자",
        "목표별 저축 관리",
        "비정기지출 관리",
      ],
      popular: false,
    },
    {
      name: "커플",
      price: "1,000원",
      period: "/월",
      features: ["모든 베이직 기능", "2명 공동 사용"],
      popular: false,
    },
    {
      name: "커플",
      price: "10,000원",
      period: "/년",
      features: ["모든 베이직 기능", "2명 공동 사용"],
      popular: true,
      originPrice: "12,000원",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-foreground to-bg-primary">
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background backdrop-blur-sm shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <HeartHandshake className="w-8 h-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">MOA</span>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#features"
                  className="text-primary-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  기능
                </a>
                <a
                  href="#testimonials"
                  className="text-primary-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  후기
                </a>
                <a
                  href="#pricing"
                  className="text-primary-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  요금
                </a>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth/login" viewTransition>
                    로그인
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  무료로 시작하기
                </Button>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <AnimatedThemeToggler variant="ghost" size="sm" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background shadow-lg rounded-lg mt-2">
                <a
                  href="#features"
                  className="block px-3 py-2 text-primary-600 hover:text-accent"
                >
                  기능
                </a>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 text-primary-600 hover:text-accent"
                >
                  후기
                </a>
                <a
                  href="#pricing"
                  className="block px-3 py-2 text-primary-600 hover:text-accent"
                >
                  요금
                </a>
                <div className="pt-2 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link to="/auth/login" viewTransition>
                      로그인
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-blue-50 text-blue-700 border-blue-200"
            >
              ✨ 부부가 함께하는 스마트 가계 관리
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                사랑하는 사람과 함께
              </span>
              <br />
              건강한 재정을 만들어가세요
            </h1>
            <p className="text-xl text-primary-600 mb-8 max-w-3xl mx-auto">
              수입부터 저축까지, 부부가 함께 투명하게 관리하는 연간 재무 계획
              서비스입니다. 잉여자금을 정확히 계산하고 목표 기반 저축으로 꿈을
              현실로 만들어보세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
              >
                <Play className="w-5 h-5 mr-2" />
                무료로 시작하기
              </Button>
            </div>
          </div>

          {/* 앱 프리뷰 */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-80 h-96 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-1 shadow-xl">
                <div className="w-full h-full bg-background rounded-md overflow-hidden">
                  <div className="bg-primary-600 p-4 text-primary">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">우리집 가계부</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4" />
                        <span>김철수 & 김영희</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-green-600 text-xs">월 총수입</div>
                        <div className="font-bold text-green-800">
                          8,300,000원
                        </div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-red-600 text-xs">월 고정지출</div>
                        <div className="font-bold text-red-800">
                          2,650,000원
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-blue-600 text-xs">잉여자금</div>
                      <div className="font-bold text-blue-800 text-lg">
                        5,150,000원
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>여행</span>
                        <span>800,000원 / 3,000,000원</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "26.7%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 플로팅 요소들 */}
              <div className="absolute -top-4 -left-8 bg-white rounded-full p-3 shadow-lg animate-bounce">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="py-16 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary/90 mb-4">
              왜 MOA를 선택해야 할까요?
            </h2>
            <p className="text-xl text-secondary/70 max-w-3xl mx-auto">
              복잡한 가계부는 그만! 부부가 함께 쉽고 재미있게 관리할 수 있는
              스마트한 기능들을 만나보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-1 shadow-md bg-foreground"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-secondary">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">활성 사용자</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">₩500억+</div>
              <div className="text-blue-200">관리되는 자산</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-200">만족도</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">2.3억원</div>
              <div className="text-blue-200">평균 절약 효과</div>
            </div>
          </div>
        </div>
      </section>

      {/* 후기 섹션 */}
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary/90 mb-4">
              사용자들의 진짜 후기
            </h2>
            <p className="text-xl text-primary/70">
              실제로 사용하고 있는 부부들의 생생한 경험을 들어보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <blockquote className="text-primary/70 mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-primary">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-primary/70">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 요금 섹션 */}
      <section id="pricing" className="py-16 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary/90 mb-4">
              우리에게 맞는 플랜을 선택하세요
            </h2>
            <p className="text-xl text-secondary/70">
              무료로 시작해서 필요에 따라 업그레이드하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-xl transition-all duration-300 bg-foreground/10 ${
                  plan.popular
                    ? "border-2 border-blue-500 transform scale-105"
                    : "border-secondary"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-primary">
                      가장 인기
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-secondary">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    {plan.originPrice ? (
                      <>
                        <span className="text-4xl font-bold text-secondary">
                          {plan.price}
                        </span>
                        <span className="text-secondary/70 line-through">
                          {plan.originPrice}
                        </span>
                        <span className="text-secondary/70">{plan.period}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-secondary">
                          {plan.price}
                        </span>
                        <span className="text-secondary/70">{plan.period}</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-secondary/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-primary"
                        : "text-secondary"
                    }`}
                  >
                    {plan.price === "무료"
                      ? "무료로 시작하기"
                      : "지금 시작하기"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            1분만에 가입하고, 우리 가족의 재정 건강을 체크해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 text-primary border-white hover:bg-white hover:text-blue-600"
            >
              무료로 시작하기
            </Button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <HeartHandshake className="w-8 h-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold">MOA</span>
              </div>
              <p className="text-gray-400">
                사랑하는 사람과 함께하는 스마트한 가계 관리 서비스
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    가계부 관리
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    저축 계획
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    재무 분석
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    목표 설정
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    도움말
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    커뮤니티
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    블로그
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    이용약관
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 MOA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
